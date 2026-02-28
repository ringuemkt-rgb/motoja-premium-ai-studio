import { Builder } from '../core';
import { RootInteractor } from './interactor';
import { RootRouter } from './router';
import { RideBuilder } from '../ride/builder';

export interface RootDependency {
  // Global dependencies
}

export class RootBuilder implements Builder<RootDependency, RootRouter> {
  dependency: RootDependency;

  constructor(dependency: RootDependency) {
    this.dependency = dependency;
  }

  build(): RootRouter {
    const interactor = new RootInteractor();
    const rideBuilder = new RideBuilder({});
    const router = new RootRouter(interactor, rideBuilder);
    
    return router;
  }
}
