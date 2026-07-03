import { Router } from '../core';
import { RideInteractor } from './interactor';

/**
 * Router for the Ride RIB.
 * In a real Uber app, this would handle transitions between
 * 'Requesting', 'Waiting', 'In-Trip', etc.
 */
export class RideRouter extends Router<RideInteractor> {
  public id = 'RIDE_RIB';

  constructor(interactor: RideInteractor) {
    super(interactor);
  }

  // RIBs specific: attach/detach children
  public attachPaymentChild() {
    // Example of attaching a child RIB
  }
}
