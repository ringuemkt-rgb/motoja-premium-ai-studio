import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  ActivityEvent,
  DeliveryProof,
  DriverVerification,
  RideRequest,
  RideStatus,
  TermsReceipt,
  UserRole,
} from '../domain';

type MotoJaState = {
  hydrated: boolean;
  userId: string;
  role: UserRole | null;
  termsReceipt: TermsReceipt | null;
  driverOnline: boolean;
  driverVerification: DriverVerification;
  rides: RideRequest[];
  activity: ActivityEvent[];
  setHydrated: (hydrated: boolean) => void;
  setRole: (role: UserRole) => void;
  acceptTerms: (receipt: TermsReceipt) => void;
  setDriverOnline: (online: boolean) => void;
  toggleDriverVerification: (key: keyof DriverVerification) => void;
  enqueueRide: (ride: RideRequest) => void;
  updateRideStatus: (id: string, status: RideStatus, remoteId?: string | null) => void;
  incrementSyncAttempt: (id: string) => void;
  saveDeliveryProof: (id: string, proof: DeliveryProof) => void;
  addActivity: (event: Omit<ActivityEvent, 'id' | 'createdAt'>) => void;
  resetLocalProfile: () => void;
};

const defaultVerification: DriverVerification = {
  cnh: false,
  appInsurance: false,
  backgroundCheck: false,
  helmetAndEpi: false,
};

const buildActivity = (event: Omit<ActivityEvent, 'id' | 'createdAt'>): ActivityEvent => ({
  ...event,
  id: Crypto.randomUUID(),
  createdAt: new Date().toISOString(),
});

export const useMotoJaStore = create<MotoJaState>()(
  persist(
    (set) => ({
      hydrated: false,
      userId: Crypto.randomUUID(),
      role: null,
      termsReceipt: null,
      driverOnline: false,
      driverVerification: defaultVerification,
      rides: [],
      activity: [],
      setHydrated: (hydrated) => set({ hydrated }),
      setRole: (role) => set({ role }),
      acceptTerms: (termsReceipt) =>
        set((state) => ({
          termsReceipt,
          activity: [
            buildActivity({
              title: 'Termos registrados',
              description: `Comprovante ${termsReceipt.acceptanceHash.slice(0, 12)}…`,
              tone: 'success',
            }),
            ...state.activity,
          ].slice(0, 100),
        })),
      setDriverOnline: (driverOnline) => set({ driverOnline }),
      toggleDriverVerification: (key) =>
        set((state) => ({
          driverVerification: {
            ...state.driverVerification,
            [key]: !state.driverVerification[key],
          },
        })),
      enqueueRide: (ride) =>
        set((state) => ({
          rides: [ride, ...state.rides],
          activity: [
            buildActivity({
              title: ride.status === 'QUEUED_OFFLINE' ? 'Pedido salvo offline' : 'Pedido criado',
              description: `${ride.pickupAddress} → ${ride.dropoffAddress}`,
              tone: ride.status === 'QUEUED_OFFLINE' ? 'warning' : 'info',
            }),
            ...state.activity,
          ].slice(0, 100),
        })),
      updateRideStatus: (id, status, remoteId = null) =>
        set((state) => ({
          rides: state.rides.map((ride) =>
            ride.id === id
              ? { ...ride, status, remoteId: remoteId ?? ride.remoteId, updatedAt: new Date().toISOString() }
              : ride,
          ),
        })),
      incrementSyncAttempt: (id) =>
        set((state) => ({
          rides: state.rides.map((ride) =>
            ride.id === id ? { ...ride, syncAttempts: ride.syncAttempts + 1 } : ride,
          ),
        })),
      saveDeliveryProof: (id, proof) =>
        set((state) => ({
          rides: state.rides.map((ride) =>
            ride.id === id ? { ...ride, proof, updatedAt: new Date().toISOString() } : ride,
          ),
          activity: [
            buildActivity({
              title: 'Comprovante de entrega registrado',
              description: `Recebido por ${proof.recipientName}`,
              tone: 'success',
            }),
            ...state.activity,
          ].slice(0, 100),
        })),
      addActivity: (event) =>
        set((state) => ({ activity: [buildActivity(event), ...state.activity].slice(0, 100) })),
      resetLocalProfile: () =>
        set({
          role: null,
          termsReceipt: null,
          driverOnline: false,
          driverVerification: defaultVerification,
          rides: [],
          activity: [],
          userId: Crypto.randomUUID(),
        }),
    }),
    {
      name: '@motoja/app-state/v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userId: state.userId,
        role: state.role,
        termsReceipt: state.termsReceipt,
        driverOnline: state.driverOnline,
        driverVerification: state.driverVerification,
        rides: state.rides,
        activity: state.activity,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
