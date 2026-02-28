import { Router, RIB } from '../core';
import { RootInteractor } from './interactor';
import { RideRouter } from '../ride/router';
import { RideBuilder } from '../ride/builder';

export class RootRouter implements Router<RootInteractor>, RIB {
  id = 'ROOT_RIB';
  interactor: RootInteractor;
  private rideRouter?: RideRouter;
  private rideBuilder: RideBuilder;

  constructor(interactor: RootInteractor, rideBuilder: RideBuilder) {
    this.interactor = interactor;
    this.rideBuilder = rideBuilder;
  }

  attachChild(child: RIB) {
    // Basic implementation
  }

  detachChild(child: RIB) {
    // Basic implementation
  }

  attachRide(): RideRouter {
    if (this.rideRouter) return this.rideRouter;
    this.rideRouter = this.rideBuilder.build();
    return this.rideRouter;
  }
}
