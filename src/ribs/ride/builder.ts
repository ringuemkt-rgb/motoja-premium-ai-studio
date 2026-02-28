import { Builder } from '../core';
import { RideDependency, RideListener, RideState } from './types';
import { RideInteractor } from './interactor';
import { RideRouter } from './router';

export class RideBuilder implements Builder<RideDependency, RideRouter> {
  dependency: RideDependency;

  constructor(dependency: RideDependency) {
    this.dependency = dependency;
  }

  build(listener?: RideListener): RideRouter {
    const initialState: RideState = {
      status: 'IDLE',
      origin: 'Minha Localização',
      destination: '',
      price: 0,
      eta: 0
    };

    const interactor = new RideInteractor(initialState, listener);
    const router = new RideRouter(interactor);
    
    return router;
  }
}
