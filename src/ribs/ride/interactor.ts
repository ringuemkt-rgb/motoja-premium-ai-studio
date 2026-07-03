import { Interactor } from '../core';
import { RideState, RideStatus, Driver, RideListener } from './types';

/**
 * Presenter interface that the View must implement
 */
export interface RidePresentable {
  updateState(state: RideState): void;
}

export class RideInteractor extends Interactor {
  private state: RideState;
  private listener?: RideListener;
  private presenter?: RidePresentable;

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
    console.log('RideInteractor: Resigning');
  }

  public async requestRide(destination: string) {
    this.updateState({ 
      status: 'SEARCHING',
      destination,
      ...this.calculateEstimate(destination)
    });

    try {
      const driver = await this.simulateDriverMatching();
      this.updateState({ status: 'ACCEPTED', driver });
    } catch (error) {
      this.cancelRide();
    }
  }

  public cancelRide() {
    this.updateState({ 
      status: 'IDLE', 
      destination: '', 
      price: 0, 
      eta: 0, 
      driver: undefined 
    });
    this.listener?.onRideCancelled();
  }

  private calculateEstimate(destination: string) {
    const distance = Math.random() * 8 + 1;
    return {
      price: Math.max(5, distance * 1.8),
      eta: Math.floor(distance * 1.5)
    };
  }

  private async simulateDriverMatching(): Promise<Driver> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "Marcos Oliveira",
          rating: 4.95,
          plate: "MOTO-2024",
          photo: "https://picsum.photos/seed/moto/200",
          vehicle: "Yamaha Fazer 250"
        });
      }, 2000);
    });
  }

  private updateState(newState: Partial<RideState>) {
    this.state = { ...this.state, ...newState };
    this.presenter?.updateState(this.state);
  }
}
