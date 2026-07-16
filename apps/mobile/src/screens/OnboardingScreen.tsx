import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UserRole } from '../domain';
import { useMotoJaStore } from '../store/useMotoJaStore';
import { colors, radius, spacing } from '../theme';
import { Brand, PrimaryButton, Screen, SectionTitle } from '../components/ui';

const roles: ReadonlyArray<{
  role: UserRole;
  icon: 'person' | 'bicycle';
  title: string;
  description: string;
}> = [
  { role: 'client', icon: 'person', title: 'Quero pedir', description: 'Mototáxi, entrega e farmácia com preço antes de confirmar.' },
  { role: 'driver', icon: 'bicycle', title: 'Sou piloto parceiro', description: 'Escolha quando ficar online e aceite ou recuse livremente.' },
];

export function OnboardingScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const setRole = useMotoJaStore((state) => state.setRole);

  return (
    <Screen>
      <View style={styles.header}>
        <Brand />
        <View style={styles.region}><Text style={styles.regionText}>BAIXO SUL • BAHIA</Text></View>
      </View>

      <View style={styles.heroMark}>
        <View style={styles.heroGlow} />
        <Ionicons name="navigate" size={46} color={colors.black} />
      </View>

      <SectionTitle
        eyebrow="Bem-vindo"
        title="Seu caminho. Do nosso jeito."
        description="Mobilidade e entregas feitas para Ituberá, Nilo Peçanha, Valença e toda a nossa região."
      />

      <View style={styles.roles}>
        {roles.map((item) => {
          const selected = selectedRole === item.role;
          return (
            <Pressable
              key={item.role}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setSelectedRole(item.role)}
              style={[styles.roleCard, selected && styles.roleCardSelected]}
            >
              <View style={[styles.roleIcon, selected && styles.roleIconSelected]}>
                <Ionicons name={item.icon} size={27} color={selected ? colors.black : colors.gold} />
              </View>
              <View style={styles.roleCopy}>
                <Text style={styles.roleTitle}>{item.title}</Text>
                <Text style={styles.roleDescription}>{item.description}</Text>
              </View>
              <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={selected ? colors.success : colors.textSecondary} />
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label="Continuar para os termos" onPress={() => selectedRole && setRole(selectedRole)} disabled={!selectedRole} icon="arrow-forward" />
      <Text style={styles.demoNote}>MVP de teste • Nenhuma cobrança real será realizada</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, marginBottom: 44 },
  region: { borderWidth: 1, borderColor: colors.stroke, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  regionText: { color: colors.textSecondary, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  heroMark: { width: 86, height: 86, borderRadius: 30, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl, overflow: 'hidden' },
  heroGlow: { position: 'absolute', width: 100, height: 40, backgroundColor: colors.goldLight, opacity: 0.55, transform: [{ rotate: '-25deg' }] },
  roles: { gap: 12, marginBottom: spacing.xl },
  roleCard: { minHeight: 108, flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1, borderColor: colors.stroke, borderRadius: radius.md, padding: 14, backgroundColor: colors.surface },
  roleCardSelected: { borderColor: colors.gold, backgroundColor: `${colors.gold}0C` },
  roleIcon: { width: 52, height: 52, borderRadius: 17, borderWidth: 1, borderColor: `${colors.gold}55`, backgroundColor: `${colors.gold}10`, alignItems: 'center', justifyContent: 'center' },
  roleIconSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  roleCopy: { flex: 1, gap: 5 },
  roleTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  roleDescription: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  demoNote: { color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 14 },
});
