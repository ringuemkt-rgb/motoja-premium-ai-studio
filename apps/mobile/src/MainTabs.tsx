import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityScreen } from './screens/ActivityScreen';
import { ClientHomeScreen } from './screens/ClientHomeScreen';
import { DriverHomeScreen } from './screens/DriverHomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { useMotoJaStore } from './store/useMotoJaStore';
import { colors, radius } from './theme';

type Tab = 'home' | 'activity' | 'profile';

const tabs: ReadonlyArray<{ id: Tab; label: string; icon: 'home' | 'time' | 'person-circle' }> = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'activity', label: 'Atividade', icon: 'time' },
  { id: 'profile', label: 'Conta', icon: 'person-circle' },
];

export function MainTabs() {
  const [tab, setTab] = useState<Tab>('home');
  const role = useMotoJaStore((state) => state.role);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {tab === 'home' ? (role === 'driver' ? <DriverHomeScreen /> : <ClientHomeScreen />) : null}
        {tab === 'activity' ? <ActivityScreen /> : null}
        {tab === 'profile' ? <ProfileScreen /> : null}
      </View>
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 9) }]}>
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <Pressable key={item.id} onPress={() => setTab(item.id)} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: active }}>
              <View style={[styles.tabIcon, active && styles.tabIconActive]}><Ionicons name={item.icon} size={21} color={active ? colors.black : colors.textSecondary} /></View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  tabBar: { position: 'absolute', left: 12, right: 12, bottom: 8, minHeight: 70, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.stroke, backgroundColor: '#15151AF4', flexDirection: 'row', paddingTop: 8, paddingHorizontal: 8 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon: { width: 36, height: 31, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabIconActive: { backgroundColor: colors.gold },
  tabLabel: { color: colors.textSecondary, fontSize: 9, fontWeight: '700' },
  tabLabelActive: { color: colors.gold, fontWeight: '900' },
});
