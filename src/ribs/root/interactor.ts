import { Interactor } from '../core';
import { RideRouter } from '../ride/router';

export class RootInteractor implements Interactor {
  didBecomeActive() {
    console.log('RootInteractor active');
  }

  willResignActive() {
    console.log('RootInteractor resigning');
  }
}
