import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { CheckboxRow, PrimaryButton, Screen, SectionTitle, StatusPill } from '../components/ui';
import type { TermsConsentKey } from '../domain';
import { useMotoJaStore } from '../store/useMotoJaStore';
import { colors, radius, spacing } from '../theme';

const TERMS_VERSION = '1.0.0-mvp';
const initialConsents: Record<TermsConsentKey, boolean> = {
  terms: false,
  privacy: false,
  intermediary: false,
  autonomy: false,
  dataProcessing: false,
};

const consentItems: ReadonlyArray<{ key: TermsConsentKey; label: string; description: string }> = [
  { key: 'terms', label: 'Li e aceito os Termos de Uso', description: 'Regras de funcionamento, cancelamento e uso responsável da plataforma.' },
  { key: 'privacy', label: 'Concordo com a Política de Privacidade', description: 'Tratamento de dados conforme a LGPD e exercício dos seus direitos.' },
  { key: 'intermediary', label: 'Entendo que o MotoJá é uma plataforma intermediadora', description: 'A plataforma conecta usuários e prestadores independentes.' },
  { key: 'autonomy', label: 'Reconheço a autonomia do piloto parceiro', description: 'O piloto escolhe quando ficar online e pode aceitar ou recusar pedidos sem punição.' },
  { key: 'dataProcessing', label: 'Autorizo o tratamento necessário dos dados', description: 'Localização, dispositivo e registros operacionais usados para prestar e proteger o serviço.' },
];

async function resolvePublicIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) return 'unavailable';
    const data = (await response.json()) as { ip?: string };
    return data.ip ?? 'unavailable';
  } catch {
    return 'offline';
  }
}

export function TermsScreen() {
  const [consents, setConsents] = useState(initialConsents);
  const [loading, setLoading] = useState(false);
  const userId = useMotoJaStore((state) => state.userId);
  const role = useMotoJaStore((state) => state.role);
  const acceptTerms = useMotoJaStore((state) => state.acceptTerms);

  const allAccepted = useMemo(() => Object.values(consents).every(Boolean), [consents]);

  const handleAccept = async () => {
    if (!allAccepted || !role) return;
    setLoading(true);
    try {
      const foreground = await Location.requestForegroundPermissionsAsync();
      const locationObject = foreground.status === 'granted'
        ? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null)
        : null;
      const location = locationObject
        ? { latitude: locationObject.coords.latitude, longitude: locationObject.coords.longitude }
        : null;
      const acceptedAt = new Date().toISOString();
      const ipAddress = await resolvePublicIp();
      const deviceInfo = [Device.manufacturer, Device.modelName, Device.osName, Device.osVersion, Application.applicationId]
        .filter(Boolean)
        .join(' | ');
      const canonical = JSON.stringify({
        userId,
        role,
        version: TERMS_VERSION,
        acceptedAt,
        ipAddress,
        location,
        deviceInfo,
        consents,
      });
      const acceptanceHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, canonical);

      acceptTerms({
        version: TERMS_VERSION,
        acceptedAt,
        acceptanceHash,
        ipAddress,
        location,
        deviceInfo,
        consents: {
          terms: true,
          privacy: true,
          intermediary: true,
          autonomy: true,
          dataProcessing: true,
        },
      });
    } catch (error) {
      Alert.alert('Não foi possível registrar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.topRow}>
        <StatusPill label={`VERSÃO ${TERMS_VERSION}`} tone="info" />
        <Text style={styles.step}>ETAPA 2 DE 2</Text>
      </View>
      <SectionTitle
        eyebrow="Transparência e privacidade"
        title="Termos de Uso e LGPD"
        description="Leia os pontos essenciais. O aceite gera um comprovante local com data, dispositivo, localização disponível e hash SHA-256."
      />

      <View style={styles.legalSummary}>
        <Text style={styles.legalTitle}>Resumo claro</Text>
        <Text style={styles.legalText}>• O preço é mostrado antes da confirmação.</Text>
        <Text style={styles.legalText}>• O piloto parceiro atua com autonomia.</Text>
        <Text style={styles.legalText}>• Dados sensíveis são usados apenas para operação e segurança.</Text>
        <Text style={styles.legalText}>• Você pode solicitar acesso, correção ou exclusão conforme a lei.</Text>
      </View>

      <View style={styles.consentList}>
        {consentItems.map((item) => (
          <CheckboxRow
            key={item.key}
            checked={consents[item.key]}
            label={item.label}
            description={item.description}
            onPress={() => setConsents((current) => ({ ...current, [item.key]: !current[item.key] }))}
          />
        ))}
      </View>

      <PrimaryButton label="Aceitar e entrar no MotoJá" onPress={handleAccept} disabled={!allAccepted} loading={loading} icon="shield-checkmark" />
      <Text style={styles.disclaimer}>O comprovante técnico apoia auditoria e rastreabilidade. Ele não substitui assinatura qualificada nem revisão jurídica profissional.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.lg, marginBottom: spacing.xl },
  step: { color: colors.textSecondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  legalSummary: { borderRadius: radius.md, borderWidth: 1, borderColor: `${colors.gold}55`, backgroundColor: `${colors.gold}0A`, padding: spacing.lg, gap: 7, marginBottom: spacing.lg },
  legalTitle: { color: colors.gold, fontSize: 13, fontWeight: '900', marginBottom: 3 },
  legalText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  consentList: { gap: 10, marginBottom: spacing.xl },
  disclaimer: { color: colors.textSecondary, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 13, paddingHorizontal: 12 },
});
