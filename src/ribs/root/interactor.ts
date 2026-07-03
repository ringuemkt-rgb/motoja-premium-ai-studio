import { Interactor } from '../core';

export class RootInteractor extends Interactor {
  public didBecomeActive() {
    super.didBecomeActive();
    console.log('RootInteractor: Active');
  }

  public willResignActive() {
    super.willResignActive();
    console.log('RootInteractor: Resigning');
  }
}
