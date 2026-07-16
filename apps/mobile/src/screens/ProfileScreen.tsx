import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Brand, Card, PrimaryButton, Screen, SectionTitle, StatusPill } from '../components/ui';
import { useMotoJaStore } from '../store/useMotoJaStore';
import { colors, spacing } from '../theme';

export function ProfileScreen() {
  const role = useMotoJaStore((state) => state.role);
  const userId = useMotoJaStore((state) => state.userId);
  const receipt = useMotoJaStore((state) => state.termsReceipt);
  const reset = useMotoJaStore((state) => state.resetLocalProfile);

  const confirmReset = () => Alert.alert(
    'Apagar dados locais de teste?',
    'Esta ação remove perfil, pedidos, verificações e comprovantes armazenados neste aparelho.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: reset },
    ],
  );

  return (
    <Screen>
      <View style={styles.top}><Brand /><StatusPill label={role === 'driver' ? 'PILOTO' : 'CLIENTE'} tone="info" /></View>
      <SectionTitle eyebrow="Conta local de teste" title="Perfil e privacidade" description="Controle seus dados e confira o comprovante técnico do aceite." />

      <Card style={styles.profileCard}>
        <View style={styles.profileIcon}><Ionicons name={role === 'driver' ? 'bicycle' : 'person'} size={28} color={colors.gold} /></View>
        <View style={styles.profileCopy}><Text style={styles.profileRole}>{role === 'driver' ? 'Piloto parceiro' : 'Cliente MotoJá'}</Text><Text style={styles.profileId}>ID {userId.slice(0, 13)}…</Text></View>
      </Card>

      {receipt ? (
        <Card style={styles.receiptCard}>
          <View style={styles.receiptHead}><Text style={styles.receiptTitle}>Comprovante de aceite</Text><Ionicons name="shield-checkmark" size={22} color={colors.success} /></View>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Versão</Text><Text style={styles.receiptValue}>{receipt.version}</Text></View>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Data</Text><Text style={styles.receiptValue}>{new Date(receipt.acceptedAt).toLocaleString('pt-BR')}</Text></View>
          <View style={styles.receiptRow}><Text style={styles.receiptLabel}>IP informado</Text><Text style={styles.receiptValue}>{receipt.ipAddress}</Text></View>
          <Text style={styles.hashLabel}>HASH SHA-256</Text>
          <Text style={styles.hash} selectable>{receipt.acceptanceHash}</Text>
        </Card>
      ) : null}

      <Card style={styles.rightsCard}>
        <Text style={styles.rightsTitle}>Seus direitos LGPD</Text>
        <Text style={styles.rightsText}>Acesso • correção • portabilidade • informação sobre compartilhamento • revogação de consentimento • exclusão quando legalmente aplicável.</Text>
        <Text style={styles.rightsContact}>Canal de teste: privacidade@motoja.com.br</Text>
      </Card>

      <PrimaryButton label="Apagar perfil e recomeçar" onPress={confirmReset} variant="danger" icon="trash" />
      <Text style={styles.version}>MotoJá MVP • Android • versão 1.0.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: spacing.md },
  profileIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: `${colors.gold}12`, borderWidth: 1, borderColor: `${colors.gold}55`, alignItems: 'center', justifyContent: 'center' },
  profileCopy: { flex: 1, gap: 4 },
  profileRole: { color: colors.text, fontSize: 17, fontWeight: '900' },
  profileId: { color: colors.textSecondary, fontSize: 10 },
  receiptCard: { marginBottom: spacing.md },
  receiptHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  receiptTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.stroke },
  receiptLabel: { color: colors.textSecondary, fontSize: 11 },
  receiptValue: { color: colors.text, fontSize: 11, fontWeight: '700', maxWidth: '65%', textAlign: 'right' },
  hashLabel: { color: colors.textSecondary, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 12 },
  hash: { color: colors.goldLight, fontSize: 9, lineHeight: 14, marginTop: 5 },
  rightsCard: { gap: 8, marginBottom: spacing.xl },
  rightsTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  rightsText: { color: colors.textSecondary, fontSize: 11, lineHeight: 17 },
  rightsContact: { color: colors.info, fontSize: 11, fontWeight: '700' },
  version: { color: colors.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 13 },
});
