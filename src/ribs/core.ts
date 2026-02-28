/**
 * Core RIBs interfaces adapted for React
 */

export interface RIB {
  id: string;
}

export interface Router<I extends Interactor> {
  interactor: I;
  attachChild(child: RIB): void;
  detachChild(child: RIB): void;
}

export interface Interactor {
  didBecomeActive(): void;
  willResignActive(): void;
}

export interface Builder<D, R extends Router<any>> {
  dependency: D;
  build(): R;
}
