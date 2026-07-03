import { Builder } from '../core';
import { RideDependency, RideListener, RideState } from './types';
import { RideInteractor } from './interactor';
import { RideRouter } from './router';

/**
 * RideBuilder: Instantiates the RIB and its components.
 * This is where dependency injection happens.
 */
export class RideBuilder extends Builder<RideDependency, RideRouter> {
  
  public build(listener?: RideListener): RideRouter {
    const initialState: RideState = {
      status: 'IDLE',
      origin: 'Minha Localização',
      destination: '',
      price: 0,
      eta: 0
    };

    // 1. Create Interactor
    const interactor = new RideInteractor(initialState, listener);
    
    // 2. Create Router
    const router = new RideRouter(interactor);
    
    return router;
  }
}
