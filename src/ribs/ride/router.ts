import { Router, RIB } from '../core';
import { RideInteractor } from './interactor';

export class RideRouter implements Router<RideInteractor>, RIB {
  id = 'RIDE_RIB';
  interactor: RideInteractor;
  private children: RIB[] = [];

  constructor(interactor: RideInteractor) {
    this.interactor = interactor;
  }

  attachChild(child: RIB) {
    this.children.push(child);
  }

  detachChild(child: RIB) {
    this.children = this.children.filter(c => c.id !== child.id);
  }
}
