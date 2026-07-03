import { Router } from '../core';
import { RootInteractor } from './interactor';
import { RideRouter } from '../ride/router';
import { RideBuilder } from '../ride/builder';

export class RootRouter extends Router<RootInteractor> {
  public id = 'ROOT_RIB';
  private rideRouter?: RideRouter;
  private rideBuilder: RideBuilder;

  constructor(interactor: RootInteractor, rideBuilder: RideBuilder) {
    super(interactor);
    this.rideBuilder = rideBuilder;
  }

  public attachRide(): RideRouter {
    if (this.rideRouter) return this.rideRouter;
    this.rideRouter = this.rideBuilder.build();
    this.attachChild(this.rideRouter);
    return this.rideRouter;
  }
}
