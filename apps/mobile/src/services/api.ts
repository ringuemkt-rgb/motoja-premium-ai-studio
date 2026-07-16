import NetInfo from '@react-native-community/netinfo';

import type { RideRequest } from '../domain';
import { useMotoJaStore } from '../store/useMotoJaStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

type SyncSummary = {
  attempted: number;
  synced: number;
  skipped: boolean;
};

export function isApiConfigured(): boolean {
  return API_URL.startsWith('https://') || API_URL.startsWith('http://10.') || API_URL.includes('localhost');
}

async function postRide(ride: RideRequest): Promise<{ id: string }> {
  const response = await fetch(`${API_URL}/api/rides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': ride.idempotencyKey,
    },
    body: JSON.stringify({
      localId: ride.id,
      category: ride.category,
      pickupAddress: ride.pickupAddress,
      dropoffAddress: ride.dropoffAddress,
      pickup: ride.pickup,
      dropoff: ride.dropoff,
      quote: ride.quote,
      pickupPhotoUri: ride.pickupPhotoUri,
      deliveryNotes: ride.deliveryNotes,
      createdAt: ride.createdAt,
    }),
  });

  if (!response.ok) throw new Error(`API respondeu ${response.status}`);
  return (await response.json()) as { id: string };
}

export async function syncQueuedRides(): Promise<SyncSummary> {
  if (!isApiConfigured()) return { attempted: 0, synced: 0, skipped: true };

  const network = await NetInfo.fetch();
  if (!network.isConnected || network.isInternetReachable === false) {
    return { attempted: 0, synced: 0, skipped: true };
  }

  const state = useMotoJaStore.getState();
  const queued = state.rides.filter((ride) => ride.status === 'QUEUED_OFFLINE' || ride.status === 'SYNC_ERROR');
  let synced = 0;

  for (const ride of queued) {
    state.incrementSyncAttempt(ride.id);
    try {
      const remote = await postRide(ride);
      useMotoJaStore.getState().updateRideStatus(ride.id, 'REQUESTED', remote.id);
      synced += 1;
    } catch {
      useMotoJaStore.getState().updateRideStatus(ride.id, 'SYNC_ERROR');
    }
  }

  if (synced > 0) {
    useMotoJaStore.getState().addActivity({
      title: 'Sincronização concluída',
      description: `${synced} pedido(s) enviado(s) para a central.`,
      tone: 'success',
    });
  }

  return { attempted: queued.length, synced, skipped: false };
}
