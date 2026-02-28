import { Interactor } from '../core';
import { RideState, RideStatus, Driver, RideListener } from './types';

export class RideInteractor implements Interactor {
  private state: RideState;
  private listener?: RideListener;
  private updateCallback?: (state: RideState) => void;

  constructor(initialState: RideState, listener?: RideListener) {
    this.state = initialState;
    this.listener = listener;
  }

  setUpdateCallback(callback: (state: RideState) => void) {
    this.updateCallback = callback;
    callback(this.state);
  }

  didBecomeActive() {
    console.log('RideInteractor active');
  }

  willResignActive() {
    console.log('RideInteractor resigning');
  }

  async requestRide(destination: string) {
    this.updateState({ 
      status: 'SEARCHING',
      destination,
      ...this.calculateEstimate(destination)
    });

    // Simulate driver matching for a Motorcycle
    try {
      const driver = await this.simulateDriverMatching();
      this.updateState({ status: 'ACCEPTED', driver });
    } catch (error) {
      this.cancelRide();
    }
  }

  cancelRide() {
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
    // Motorcycle specific pricing: cheaper and faster than cars
    const distance = Math.random() * 8 + 1;
    return {
      price: Math.max(5, distance * 1.8), // MotoJá Premium is affordable
      eta: Math.floor(distance * 1.5) // Motos are faster in traffic
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
    this.updateCallback?.(this.state);
  }
}
