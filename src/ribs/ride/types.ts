export type RideStatus =
  | 'IDLE'
  | 'REQUESTED'
  | 'MATCHING'
  | 'ACCEPTED'
  | 'ARRIVING'
  | 'IN_TRIP'
  | 'COMPLETED'
  | 'CANCELED';

export type RideCategory = 'MotoJá Normal' | 'MotoJá Expresso' | 'Entrega' | 'Farmácia';

export interface DriverBadge {
  code: 'verified_driver' | 'excellent_service' | 'high_punctuality' | 'premium';
  label: string;
}

export interface Driver {
  name: string;
  rating: number;
  plate: string;
  photo: string;
  vehicle: string;
  badges?: DriverBadge[];
  etaMin?: number;
}

export interface RideFinancials {
  priceCents: number;
  platformFeeCents: number;
  driverEarningCents: number;
}

export interface RideState {
  status: RideStatus;
  origin: string;
  destination: string;
  category: RideCategory;
  distanceKm: number;
  eta: number;
  price: number;
  financials: RideFinancials;
  driver?: Driver;
}

export interface RideListener {
  onRideCompleted(): void;
  onRideCancelled(): void;
}

export interface RideDependency {
  // Future production dependencies:
  // - rideRepository
  // - pricingService
  // - notificationService
  // - analyticsService
}
