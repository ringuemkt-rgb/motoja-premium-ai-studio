import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Brand, Card, PrimaryButton, Screen, StatusPill } from '../components/ui';
import { formatBrl, type DriverVerification } from '../domain';
import { requestDriverLocationPermissions, startDriverTracking, stopDriverTracking } from '../services/backgroundLocation';
import { useMotoJaStore } from '../store/useMotoJaStore';
import { colors, radius, spacing } from '../theme';

const checks: ReadonlyArray<{ key: keyof DriverVerification; label: string; description: string }> = [
  { key: 'cnh', label: 'CNH válida', description: 'Documento conferido e dentro da validade' },
  { key: 'appInsurance', label: 'Seguro APP', description: 'Proteção de acidentes pessoais informada' },
  { key: 'backgroundCheck', label: 'Antecedentes', description: 'Certidão de antecedentes verificada' },
  { key: 'helmetAndEpi', label: 'Capacete e EPI próprios', description: 'Equipamentos do prestador independente' },
];

export function DriverHomeScreen() {
  const online = useMotoJaStore((state) => state.driverOnline);
  const verification = useMotoJaStore((state) => state.driverVerification);
  const setOnline = useMotoJaStore((state) => state.setDriverOnline);
  const toggleCheck = useMotoJaStore((state) => state.toggleDriverVerification);
  const addActivity = useMotoJaStore((state) => state.addActivity);
  const [busy, setBusy] = useState(false);
  const [offerVisible, setOfferVisible] = useState(true);
  const verified = Object.values(verification).every(Boolean);

  const toggleOnline = async () => {
    if (busy) return;
    if (online) {
      setBusy(true);
      try {
        await stopDriverTracking();
        setOnline(false);
        addActivity({ title: 'Piloto offline', description: 'Você parou de receber novos pedidos.', tone: 'info' });
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!verified) {
      Alert.alert('Verificação pendente', 'Conclua os quatro itens de segurança antes de ficar online.');
      return;
    }

    setBusy(true);
    try {
      const permission = await requestDriverLocationPermissions();
      if (!permission.foreground || !permission.background) {
        Alert.alert('Localização em segundo plano necessária', 'Nas configurações do Android, permita localização o tempo todo para operar online.');
        return;
      }
      await Notifications.requestPermissionsAsync().catch(() => undefined);
      await startDriverTracking();
      setOnline(true);
      setOfferVisible(true);
      addActivity({ title: 'Piloto online', description: 'Você escolheu começar a receber oportunidades.', tone: 'success' });
    } catch (error) {
      Alert.alert('Não foi possível ficar online', error instanceof Error ? error.message : 'Verifique as permissões.');
    } finally {
      setBusy(false);
    }
  };

  const respondOffer = (accepted: boolean) => {
    setOfferVisible(false);
    addActivity({
      title: accepted ? 'Corrida aceita' : 'Corrida recusada livremente',
      description: accepted ? 'Praça da Feira → Orla de Ituberá' : 'Sem redução de nota ou penalidade automática.',
      tone: accepted ? 'success' : 'info',
    });
    Alert.alert(accepted ? 'Corrida aceita' : 'Corrida recusada', accepted ? 'A rota de coleta foi liberada.' : 'Sua autonomia foi respeitada. Não há penalidade automática.');
  };

  return (
    <Screen>
      <View style={styles.header}><Brand /><StatusPill label="PILOTO PARCEIRO" tone="info" /></View>

      <Card style={[styles.onlineCard, online && styles.onlineCardActive]}>
        <View style={styles.onlineTop}>
          <View style={[styles.onlineIcon, online && styles.onlineIconActive]}><Ionicons name="power" size={26} color={online ? colors.black : colors.textSecondary} /></View>
          <View style={styles.onlineCopy}>
            <Text style={styles.onlineTitle}>{online ? 'Você está online' : 'Você está offline'}</Text>
            <Text style={styles.onlineDescription}>{online ? 'Recebendo oportunidades na sua região' : 'Você decide quando quer trabalhar'}</Text>
          </View>
          <Switch value={online} onValueChange={toggleOnline} disabled={busy} trackColor={{ false: colors.stroke, true: colors.success }} thumbColor={online ? colors.text : colors.textSecondary} />
        </View>
        <View style={styles.autonomy}><Ionicons name="shield-checkmark" size={17} color={colors.gold} /><Text style={styles.autonomyText}>Sem jornada obrigatória, exclusividade ou punição automática por recusa.</Text></View>
      </Card>

      <View style={styles.kpis}>
        <Card style={styles.kpi}><Text style={styles.kpiLabel}>GANHOS HOJE</Text><Text style={styles.kpiValue}>{formatBrl(0)}</Text><Text style={styles.kpiHint}>80% por serviço</Text></Card>
        <Card style={styles.kpi}><Text style={styles.kpiLabel}>AVALIAÇÃO</Text><Text style={styles.kpiValue}>5,0</Text><Text style={styles.kpiHint}>piloto verificado</Text></Card>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Verificação de segurança</Text><Text style={styles.progress}>{Object.values(verification).filter(Boolean).length}/4</Text></View>
      <View style={styles.checkList}>
        {checks.map((item) => {
          const checked = verification[item.key];
          return (
            <Pressable key={item.key} onPress={() => toggleCheck(item.key)} style={[styles.checkRow, checked && styles.checkRowDone]}>
              <View style={[styles.checkIcon, checked && styles.checkIconDone]}><Ionicons name={checked ? 'checkmark' : 'document-text-outline'} size={18} color={checked ? colors.black : colors.gold} /></View>
              <View style={styles.checkCopy}><Text style={styles.checkTitle}>{item.label}</Text><Text style={styles.checkDescription}>{item.description}</Text></View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          );
        })}
      </View>

      {online && verified && offerVisible ? (
        <Card style={styles.offerCard}>
          <View style={styles.offerHead}><View><Text style={styles.offerEyebrow}>NOVA OPORTUNIDADE</Text><Text style={styles.offerTitle}>MotoJá Normal</Text></View><Text style={styles.offerPrice}>{formatBrl(1040)}</Text></View>
          <View style={styles.offerRoute}><View style={styles.routeDot} /><Text style={styles.offerText}>Praça da Feira</Text></View>
          <View style={styles.routeStem} />
          <View style={styles.offerRoute}><View style={[styles.routeDot, styles.routeDotEnd]} /><Text style={styles.offerText}>Orla de Ituberá</Text></View>
          <View style={styles.offerMeta}><Text style={styles.offerMetaText}>3,8 km</Text><Text style={styles.offerMetaText}>•</Text><Text style={styles.offerMetaText}>aprox. 12 min</Text></View>
          <View style={styles.offerActions}><View style={styles.actionHalf}><PrimaryButton label="Recusar" onPress={() => respondOffer(false)} variant="outline" /></View><View style={styles.actionHalf}><PrimaryButton label="Aceitar" onPress={() => respondOffer(true)} /></View></View>
          <Text style={styles.noPenalty}>Recusar não reduz nota e não gera penalidade automática.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl },
  onlineCard: { marginBottom: spacing.md },
  onlineCardActive: { borderColor: `${colors.success}88`, backgroundColor: `${colors.success}0A` },
  onlineTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  onlineIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' },
  onlineIconActive: { backgroundColor: colors.success },
  onlineCopy: { flex: 1, gap: 3 },
  onlineTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  onlineDescription: { color: colors.textSecondary, fontSize: 11 },
  autonomy: { marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.stroke, paddingTop: spacing.md, flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  autonomyText: { flex: 1, color: colors.textSecondary, fontSize: 11, lineHeight: 16 },
  kpis: { flexDirection: 'row', gap: 10, marginBottom: spacing.xl },
  kpi: { flex: 1, padding: 14 },
  kpiLabel: { color: colors.textSecondary, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  kpiValue: { color: colors.text, fontSize: 23, fontWeight: '900', marginVertical: 5 },
  kpiHint: { color: colors.success, fontSize: 10, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  progress: { color: colors.gold, fontSize: 12, fontWeight: '900' },
  checkList: { gap: 9, marginBottom: spacing.xl },
  checkRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: radius.md, borderWidth: 1, borderColor: colors.stroke, backgroundColor: colors.surface, padding: 12 },
  checkRowDone: { borderColor: `${colors.success}55` },
  checkIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: `${colors.gold}12`, alignItems: 'center', justifyContent: 'center' },
  checkIconDone: { backgroundColor: colors.success },
  checkCopy: { flex: 1, gap: 3 },
  checkTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  checkDescription: { color: colors.textSecondary, fontSize: 10, lineHeight: 14 },
  offerCard: { borderColor: colors.gold, marginBottom: spacing.xl },
  offerHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  offerEyebrow: { color: colors.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  offerTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 3 },
  offerPrice: { color: colors.success, fontSize: 23, fontWeight: '900' },
  offerRoute: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold },
  routeDotEnd: { backgroundColor: colors.success },
  routeStem: { width: 1, height: 18, backgroundColor: colors.stroke, marginLeft: 4.5 },
  offerText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  offerMeta: { flexDirection: 'row', gap: 8, marginTop: spacing.md, marginBottom: spacing.lg },
  offerMetaText: { color: colors.textSecondary, fontSize: 11 },
  offerActions: { flexDirection: 'row', gap: 9 },
  actionHalf: { flex: 1 },
  noPenalty: { color: colors.textSecondary, fontSize: 9, textAlign: 'center', marginTop: 10 },
});
