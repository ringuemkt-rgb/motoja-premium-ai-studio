export type UserRole = 'client' | 'driver';

export type ServiceCategory = 'NORMAL' | 'EXPRESS' | 'DELIVERY' | 'PHARMACY';

export type RideStatus =
  | 'QUEUED_OFFLINE'
  | 'REQUESTED'
  | 'MATCHING'
  | 'ACCEPTED'
  | 'ARRIVING'
  | 'IN_TRIP'
  | 'COMPLETED'
  | 'CANCELED'
  | 'SYNC_ERROR';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type FareQuote = {
  category: ServiceCategory;
  distanceMeters: number;
  totalCents: number;
  platformFeeCents: number;
  driverEarningsCents: number;
};

export type TermsReceipt = {
  version: string;
  acceptedAt: string;
  acceptanceHash: string;
  ipAddress: string;
  location: Coordinates | null;
  deviceInfo: string;
  consents: Record<TermsConsentKey, true>;
};

export type TermsConsentKey =
  | 'terms'
  | 'privacy'
  | 'intermediary'
  | 'autonomy'
  | 'dataProcessing';

export type DeliveryProof = {
  recordedAt: string;
  recipientName: string;
  signatureHash: string;
  photoUri: string | null;
};

export type RideRequest = {
  id: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  category: ServiceCategory;
  status: RideStatus;
  pickupAddress: string;
  dropoffAddress: string;
  pickup: Coordinates;
  dropoff: Coordinates;
  quote: FareQuote;
  pickupPhotoUri: string | null;
  deliveryNotes: string | null;
  remoteId: string | null;
  syncAttempts: number;
  proof: DeliveryProof | null;
};

export type DriverVerification = {
  cnh: boolean;
  appInsurance: boolean;
  backgroundCheck: boolean;
  helmetAndEpi: boolean;
};

export type ActivityEvent = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  tone: 'info' | 'success' | 'warning' | 'error';
};

export const SERVICE_CATEGORIES: ReadonlyArray<{
  code: ServiceCategory;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  { code: 'NORMAL', label: 'MotoJá Normal', shortLabel: 'Normal', description: 'Melhor custo para o dia a dia' },
  { code: 'EXPRESS', label: 'MotoJá Expresso', shortLabel: 'Expresso', description: 'Prioridade no chamado' },
  { code: 'DELIVERY', label: 'Entrega', shortLabel: 'Entrega', description: 'Coleta com comprovante' },
  { code: 'PHARMACY', label: 'Farmácia', shortLabel: 'Farmácia', description: 'Fluxo dedicado e rastreável' },
] as const;

const FARE_RULES: Record<ServiceCategory, { baseCents: number; perKmCents: number }> = {
  NORMAL: { baseCents: 500, perKmCents: 220 },
  EXPRESS: { baseCents: 650, perKmCents: 275 },
  DELIVERY: { baseCents: 700, perKmCents: 240 },
  PHARMACY: { baseCents: 750, perKmCents: 250 },
};

export const MINIMUM_FARE_CENTS = 1200;
export const PLATFORM_PERCENT = 20;
export const DRIVER_PERCENT = 80;

export function calculateFare(category: ServiceCategory, distanceMeters: number): FareQuote {
  const safeMeters = Math.max(0, Math.round(distanceMeters));
  const rule = FARE_RULES[category];
  const distanceCents = Math.round((safeMeters * rule.perKmCents) / 1000);
  const totalCents = Math.max(MINIMUM_FARE_CENTS, rule.baseCents + distanceCents);
  const platformFeeCents = Math.round((totalCents * PLATFORM_PERCENT) / 100);

  return {
    category,
    distanceMeters: safeMeters,
    totalCents,
    platformFeeCents,
    driverEarningsCents: totalCents - platformFeeCents,
  };
}

export function formatBrl(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export const ITUBERA_CENTER: Coordinates = {
  latitude: -13.7318,
  longitude: -39.1492,
};

export function offsetDestination(origin: Coordinates, distanceMeters: number): Coordinates {
  const latitudeDelta = distanceMeters / 111_320;
  const longitudeDelta = distanceMeters / (111_320 * Math.cos((origin.latitude * Math.PI) / 180));
  return {
    latitude: origin.latitude + latitudeDelta * 0.55,
    longitude: origin.longitude + longitudeDelta * 0.84,
  };
}
