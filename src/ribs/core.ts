/**
 * Uber RIBs Core Implementation for React/TypeScript
 * Following the official architecture: Router, Interactor, Builder
 */

export interface RIB {
  id: string;
}

/**
 * Interactor: Contains the business logic.
 * It is the 'Brain' of the RIB.
 */
export abstract class Interactor {
  protected active: boolean = false;

  public didBecomeActive(): void {
    this.active = true;
  }

  public willResignActive(): void {
    this.active = false;
  }

  public isActive(): boolean {
    return this.active;
  }
}

/**
 * Router: Handles navigation and view switching.
 * It attaches and detaches child RIBs.
 */
export abstract class Router<I extends Interactor> implements RIB {
  public abstract id: string;
  protected children: RIB[] = [];

  constructor(public readonly interactor: I) {}

  public attachChild(child: Router<any>): void {
    this.children.push(child);
    child.interactor.didBecomeActive();
  }

  public detachChild(child: Router<any>): void {
    child.interactor.willResignActive();
    this.children = this.children.filter(c => c.id !== child.id);
  }
}

/**
 * Builder: The factory that instantiates the RIB's components.
 */
export abstract class Builder<D, R extends Router<any>> {
  constructor(protected readonly dependency: D) {}
  public abstract build(listener?: any): R;
}

/**
 * Component: Defines the dependencies required by this RIB.
 */
export interface Component<D> {
  dependency: D;
}
