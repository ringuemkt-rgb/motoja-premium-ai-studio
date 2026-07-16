import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '../theme';

export function Screen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={styles.screenContent}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brandRow} accessibilityLabel="MotoJá">
      <View style={[styles.brandMark, compact && styles.brandMarkCompact]}>
        <Text style={[styles.brandMarkText, compact && styles.brandMarkTextCompact]}>M</Text>
        <View style={styles.brandRoute} />
      </View>
      {!compact && (
        <Text style={styles.brandWord}>
          Moto<Text style={styles.brandWordGold}>Já</Text>
        </Text>
      )}
    </View>
  );
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <View style={styles.sectionTitle}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'gold',
  icon,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'gold' | 'outline' | 'danger';
  icon?: ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'outline' && styles.buttonOutline,
        variant === 'danger' && styles.buttonDanger,
        (disabled || loading) && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.gold : colors.black} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={19} color={variant === 'outline' ? colors.gold : colors.black} /> : null}
          <Text style={[styles.buttonText, variant === 'outline' && styles.buttonTextOutline]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Input({ label, icon, ...props }: TextInputProps & { label: string; icon?: ComponentProps<typeof Ionicons>['name'] }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputShell}>
        {icon ? <Ionicons name={icon} color={colors.gold} size={18} /> : null}
        <TextInput
          placeholderTextColor="#777782"
          selectionColor={colors.gold}
          style={styles.input}
          {...props}
        />
      </View>
    </View>
  );
}

export function CheckboxRow({
  checked,
  label,
  onPress,
  description,
}: {
  checked: boolean;
  label: string;
  onPress: () => void;
  description?: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.checkboxRow, checked && styles.checkboxRowChecked]} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={16} color={colors.black} /> : null}
      </View>
      <View style={styles.checkboxCopy}>
        <Text style={styles.checkboxLabel}>{label}</Text>
        {description ? <Text style={styles.checkboxDescription}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

export function StatusPill({ label, tone = 'info' }: { label: string; tone?: 'info' | 'success' | 'warning' | 'error' }) {
  const toneColor = tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : tone === 'error' ? colors.error : colors.info;
  return (
    <View style={[styles.statusPill, { borderColor: `${toneColor}66`, backgroundColor: `${toneColor}18` }]}>
      <View style={[styles.statusDot, { backgroundColor: toneColor }]} />
      <Text style={[styles.statusText, { color: toneColor }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ icon, title, description }: { icon: ComponentProps<typeof Ionicons>['name']; title: string; description: string }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><Ionicons name={icon} color={colors.gold} size={28} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
}

export function DividerLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.dividerLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screenContent: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: 116 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  brandMarkCompact: { width: 36, height: 36, borderRadius: 12 },
  brandMarkText: { color: colors.black, fontSize: 28, lineHeight: 34, fontWeight: '900', letterSpacing: -3 },
  brandMarkTextCompact: { fontSize: 21, lineHeight: 25 },
  brandRoute: { position: 'absolute', width: 29, height: 5, borderRadius: 4, backgroundColor: colors.black, transform: [{ rotate: '-38deg' }], bottom: 11, right: -2 },
  brandWord: { color: colors.text, fontSize: 29, fontWeight: '900', letterSpacing: -1.5 },
  brandWordGold: { color: colors.gold },
  sectionTitle: { gap: 7, marginBottom: spacing.xl },
  eyebrow: { color: colors.gold, fontSize: 11, fontWeight: '900', letterSpacing: 1.7 },
  title: { color: colors.text, fontSize: 30, lineHeight: 35, fontWeight: '900', letterSpacing: -1.2 },
  description: { color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.stroke, borderRadius: radius.md, padding: spacing.lg },
  button: { minHeight: 54, borderRadius: radius.md, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, paddingHorizontal: spacing.lg },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.gold },
  buttonDanger: { backgroundColor: colors.error },
  buttonDisabled: { opacity: 0.42 },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.86 },
  buttonText: { color: colors.black, fontSize: 15, fontWeight: '900', letterSpacing: 0.1 },
  buttonTextOutline: { color: colors.gold },
  inputGroup: { gap: 7 },
  inputLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  inputShell: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.stroke, backgroundColor: colors.surfaceSecondary, paddingHorizontal: 14 },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 12 },
  checkboxRow: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.stroke, backgroundColor: colors.surface, alignItems: 'flex-start' },
  checkboxRowChecked: { borderColor: `${colors.success}88`, backgroundColor: `${colors.success}0E` },
  checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: colors.textSecondary, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxChecked: { backgroundColor: colors.success, borderColor: colors.success },
  checkboxCopy: { flex: 1, gap: 3 },
  checkboxLabel: { color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  checkboxDescription: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  statusPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '900' },
  emptyState: { minHeight: 230, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 9 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, borderWidth: 1, borderColor: `${colors.gold}55`, backgroundColor: `${colors.gold}12`, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptyDescription: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  dividerLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginTop: spacing.sm, marginBottom: spacing.sm },
});
