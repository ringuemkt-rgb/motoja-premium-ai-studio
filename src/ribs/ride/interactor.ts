import { Interactor } from '../core';
import { RideState, Driver, RideListener, RideCategory, RideFinancials } from './types';

const MINIMUM_FARE_CENTS = 1200;
const PLATFORM_FEE_PERCENT = 0.2;
const ITUBERA_CENTER = 'Centro de Ituberá-BA';

/**
 * Presenter interface that the View must implement.
 */
export interface RidePresentable {
  updateState(state: RideState): void;
}

export class RideInteractor extends Interactor {
  private state: RideState;
  private listener?: RideListener;
  private presenter?: RidePresentable;
  private rideTimer?: number;

  constructor(initialState: RideState, listener?: RideListener) {
    super();
    this.state = initialState;
    this.listener = listener;
  }

  public setPresenter(presenter: RidePresentable) {
    this.presenter = presenter;
    this.presenter.updateState(this.state);
  }

  public didBecomeActive() {
    super.didBecomeActive();
    console.log('RideInteractor: Active');
  }

  public willResignActive() {
    super.willResignActive();
    if (this.rideTimer) window.clearTimeout(this.rideTimer);
    console.log('RideInteractor: Resigning');
  }

  public async requestRide(destination: string, category: RideCategory = 'MotoJá Normal') {
    const estimate = this.calculateEstimate(destination, category);

    this.updateState({
      status: 'REQUESTED',
      destination,
      category,
      ...estimate,
    });

    this.rideTimer = window.setTimeout(() => {
      this.updateState({ status: 'MATCHING' });
    }, 500);

    try {
      const driver = await this.simulateDriverMatching();
      this.updateState({ status: 'ACCEPTED', driver, eta: driver.etaMin ?? estimate.eta });

      this.rideTimer = window.setTimeout(() => {
        this.updateState({ status: 'ARRIVING' });
      }, 1800);
    } catch (error) {
      this.cancelRide();
    }
  }

  public markInTrip() {
    this.updateState({ status: 'IN_TRIP' });
  }

  public completeRide() {
    this.updateState({ status: 'COMPLETED' });
    this.listener?.onRideCompleted();
  }

  public cancelRide() {
    if (this.rideTimer) window.clearTimeout(this.rideTimer);
    this.updateState({
      status: 'CANCELED',
      destination: '',
      price: 0,
      distanceKm: 0,
      eta: 0,
      driver: undefined,
      financials: this.calculateSplit(0),
    });

    window.setTimeout(() => {
      this.updateState({
        status: 'IDLE',
        origin: ITUBERA_CENTER,
        category: 'MotoJá Normal',
        destination: '',
        price: 0,
        distanceKm: 0,
        eta: 0,
        driver: undefined,
        financials: this.calculateSplit(0),
      });
    }, 700);

    this.listener?.onRideCancelled();
  }

  private calculateEstimate(destination: string, category: RideCategory) {
    const normalized = destination.trim().toLowerCase();
    const distanceSeed = Math.max(1.4, Math.min(9.5, normalized.length * 0.42));
    const categoryMultiplier = category === 'MotoJá Expresso' ? 1.25 : category === 'Farmácia' ? 1.15 : category === 'Entrega' ? 1.1 : 1;
    const baseCents = Math.round((900 + distanceSeed * 220) * categoryMultiplier);
    const priceCents = Math.max(MINIMUM_FARE_CENTS, baseCents);

    return {
      price: priceCents / 100,
      distanceKm: Number(distanceSeed.toFixed(1)),
      eta: Math.max(3, Math.round(distanceSeed * 1.6)),
      financials: this.calculateSplit(priceCents),
    };
  }

  private calculateSplit(priceCents: number): RideFinancials {
    const platformFeeCents = Math.round(priceCents * PLATFORM_FEE_PERCENT);
    return {
      priceCents,
      platformFeeCents,
      driverEarningCents: priceCents - platformFeeCents,
    };
  }

  private async simulateDriverMatching(): Promise<Driver> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'Carlos MotoJá',
          rating: 4.95,
          plate: 'JQX-2026',
          photo: 'https://picsum.photos/seed/motoja-driver/200',
          vehicle: 'Honda CG 160',
          etaMin: 4,
          badges: [
            { code: 'verified_driver', label: 'Piloto Verificado' },
            { code: 'high_punctuality', label: 'Alta Pontualidade' },
          ],
        });
      }, 1800);
    });
  }

  private updateState(newState: Partial<RideState>) {
    this.state = { ...this.state, ...newState };
    this.presenter?.updateState(this.state);
  }
}
