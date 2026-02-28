export type RideStatus = 'IDLE' | 'SEARCHING' | 'ACCEPTED' | 'ARRIVING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Driver {
  name: string;
  rating: number;
  plate: string;
  photo: string;
  vehicle: string;
}

export interface RideState {
  status: RideStatus;
  origin: string;
  destination: string;
  price: number;
  eta: number;
  driver?: Driver;
}

export interface RideListener {
  onRideCompleted(): void;
  onRideCancelled(): void;
}

export interface RideDependency {
  // Dependencies passed from parent
}
