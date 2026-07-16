import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import type { Coordinates } from '../domain';

export const BACKGROUND_LOCATION_TASK = 'motoja-driver-background-location';
const LOCATION_QUEUE_KEY = '@motoja/location-queue/v1';
const MAX_SAMPLES = 250;

export type LocationSample = Coordinates & {
  capturedAt: string;
  accuracy: number | null;
};

async function appendLocationSamples(samples: LocationSample[]): Promise<void> {
  const currentRaw = await AsyncStorage.getItem(LOCATION_QUEUE_KEY);
  const current = currentRaw ? (JSON.parse(currentRaw) as LocationSample[]) : [];
  await AsyncStorage.setItem(LOCATION_QUEUE_KEY, JSON.stringify([...current, ...samples].slice(-MAX_SAMPLES)));
}

if (!TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK)) {
  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
    if (error || !data) return;
    const payload = data as { locations?: Location.LocationObject[] };
    const samples = (payload.locations ?? []).map<LocationSample>((location) => ({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      capturedAt: new Date(location.timestamp).toISOString(),
    }));
    if (samples.length > 0) await appendLocationSamples(samples);
  });
}

export async function requestDriverLocationPermissions(): Promise<{
  foreground: boolean;
  background: boolean;
}> {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') return { foreground: false, background: false };

  const background = await Location.requestBackgroundPermissionsAsync();
  return { foreground: true, background: background.status === 'granted' };
}

export async function startDriverTracking(): Promise<void> {
  const active = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (active) return;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 15_000,
    distanceInterval: 25,
    deferredUpdatesDistance: 50,
    deferredUpdatesInterval: 30_000,
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'MotoJá — piloto online',
      notificationBody: 'Localização ativa para receber e acompanhar corridas.',
      notificationColor: '#FFC107',
      killServiceOnDestroy: false,
    },
  });
}

export async function stopDriverTracking(): Promise<void> {
  const active = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (active) await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
}

export async function readLocationQueue(): Promise<LocationSample[]> {
  const raw = await AsyncStorage.getItem(LOCATION_QUEUE_KEY);
  return raw ? (JSON.parse(raw) as LocationSample[]) : [];
}

export async function clearLocationQueue(): Promise<void> {
  await AsyncStorage.removeItem(LOCATION_QUEUE_KEY);
}
