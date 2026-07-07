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
      origin: 'Centro de Ituberá-BA',
      destination: '',
      category: 'MotoJá Normal',
      distanceKm: 0,
      price: 0,
      eta: 0,
      financials: {
        priceCents: 0,
        platformFeeCents: 0,
        driverEarningCents: 0,
      },
    };

    const interactor = new RideInteractor(initialState, listener);
    const router = new RideRouter(interactor);

    return router;
  }
}
