import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Brand } from './src/components/ui';
import { MainTabs } from './src/MainTabs';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { TermsScreen } from './src/screens/TermsScreen';
import './src/services/backgroundLocation';
import { syncQueuedRides } from './src/services/api';
import { useMotoJaStore } from './src/store/useMotoJaStore';
import { colors } from './src/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppContent() {
  const hydrated = useMotoJaStore((state) => state.hydrated);
  const role = useMotoJaStore((state) => state.role);
  const receipt = useMotoJaStore((state) => state.termsReceipt);

  useEffect(() => {
    void (async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('motoja-operacao', {
          name: 'Operação MotoJá',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 200, 120, 200],
          lightColor: colors.gold,
        });
      }
    })();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) void syncQueuedRides();
    });
    return unsubscribe;
  }, []);

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <Brand />
        <ActivityIndicator color={colors.gold} size="large" />
        <Text style={styles.loadingText}>Preparando sua operação offline…</Text>
      </View>
    );
  }
  if (!role) return <OnboardingScreen />;
  if (!receipt) return <TermsScreen />;
  return <MainTabs />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 22 },
  loadingText: { color: colors.textSecondary, fontSize: 12 },
});
