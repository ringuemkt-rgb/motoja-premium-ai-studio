import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { DeliveryProofModal } from '../components/DeliveryProofModal';
import { Card, EmptyState, PrimaryButton, Screen, SectionTitle, StatusPill } from '../components/ui';
import { formatBrl, type RideRequest, type RideStatus } from '../domain';
import { syncQueuedRides } from '../services/api';
import { useMotoJaStore } from '../store/useMotoJaStore';
import { colors, spacing } from '../theme';

const statusMap: Record<RideStatus, { label: string; tone: 'info' | 'success' | 'warning' | 'error' }> = {
  QUEUED_OFFLINE: { label: 'NA FILA OFFLINE', tone: 'warning' },
  REQUESTED: { label: 'SOLICITADA', tone: 'info' },
  MATCHING: { label: 'BUSCANDO PILOTO', tone: 'info' },
  ACCEPTED: { label: 'ACEITA', tone: 'success' },
  ARRIVING: { label: 'PILOTO CHEGANDO', tone: 'success' },
  IN_TRIP: { label: 'EM ANDAMENTO', tone: 'success' },
  COMPLETED: { label: 'CONCLUÍDA', tone: 'success' },
  CANCELED: { label: 'CANCELADA', tone: 'error' },
  SYNC_ERROR: { label: 'ERRO DE SINCRONIZAÇÃO', tone: 'error' },
};

function RideCard({ ride, onProof }: { ride: RideRequest; onProof: () => void }) {
  const status = statusMap[ride.status];
  const delivery = ride.category === 'DELIVERY' || ride.category === 'PHARMACY';
  return (
    <Card style={styles.rideCard}>
      <View style={styles.rideHead}><View><Text style={styles.rideCategory}>{ride.category}</Text><Text style={styles.rideDate}>{new Date(ride.createdAt).toLocaleString('pt-BR')}</Text></View><StatusPill label={status.label} tone={status.tone} /></View>
      <View style={styles.routeRow}><Ionicons name="radio-button-on" color={colors.gold} size={15} /><Text style={styles.routeText}>{ride.pickupAddress}</Text></View>
      <View style={styles.routeStem} />
      <View style={styles.routeRow}><Ionicons name="location" color={colors.success} size={15} /><Text style={styles.routeText}>{ride.dropoffAddress}</Text></View>
      <View style={styles.rideFooter}><Text style={styles.ridePrice}>{formatBrl(ride.quote.totalCents)}</Text><Text style={styles.syncInfo}>tentativas: {ride.syncAttempts}</Text></View>
      {delivery ? (
        <PrimaryButton
          label={ride.proof ? `Recebido por ${ride.proof.recipientName}` : 'Registrar comprovante de entrega'}
          onPress={onProof}
          disabled={Boolean(ride.proof)}
          variant="outline"
          icon={ride.proof ? 'checkmark-circle' : 'create'}
        />
      ) : null}
    </Card>
  );
}

export function ActivityScreen() {
  const rides = useMotoJaStore((state) => state.rides);
  const events = useMotoJaStore((state) => state.activity);
  const saveProof = useMotoJaStore((state) => state.saveDeliveryProof);
  const [proofRideId, setProofRideId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const sync = async () => {
    setSyncing(true);
    try {
      const result = await syncQueuedRides();
      Alert.alert(
        result.skipped ? 'Sincronização aguardando' : 'Sincronização concluída',
        result.skipped ? 'A API ainda não está configurada ou a internet está indisponível.' : `${result.synced} de ${result.attempted} pedido(s) enviados.`,
      );
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Screen>
      <View style={styles.top}><SectionTitle eyebrow="Histórico local" title="Atividade" description="Pedidos, sincronizações e comprovantes preservados no aparelho." /></View>
      <PrimaryButton label="Sincronizar agora" onPress={sync} loading={syncing} variant="outline" icon="sync" />

      <Text style={styles.sectionLabel}>PEDIDOS</Text>
      {rides.length === 0 ? <EmptyState icon="receipt-outline" title="Nenhum pedido ainda" description="Sua primeira corrida ou entrega aparecerá aqui, inclusive quando criada sem internet." /> : <View style={styles.list}>{rides.map((ride) => <RideCard key={ride.id} ride={ride} onProof={() => setProofRideId(ride.id)} />)}</View>}

      <Text style={styles.sectionLabel}>AUDITORIA LOCAL</Text>
      {events.length === 0 ? <EmptyState icon="shield-checkmark-outline" title="Sem eventos" description="Eventos importantes do app serão registrados aqui." /> : (
        <View style={styles.events}>{events.slice(0, 15).map((event) => <View key={event.id} style={styles.event}><View style={[styles.eventDot, { backgroundColor: event.tone === 'success' ? colors.success : event.tone === 'warning' ? colors.warning : event.tone === 'error' ? colors.error : colors.info }]} /><View style={styles.eventCopy}><Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.eventDescription}>{event.description}</Text><Text style={styles.eventDate}>{new Date(event.createdAt).toLocaleString('pt-BR')}</Text></View></View>)}</View>
      )}

      <DeliveryProofModal
        visible={Boolean(proofRideId)}
        onClose={() => setProofRideId(null)}
        onSave={(proof) => {
          if (proofRideId) saveProof(proofRideId, proof);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: spacing.xl },
  sectionLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: spacing.xl, marginBottom: 10 },
  list: { gap: 10 },
  rideCard: { gap: 12 },
  rideHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rideCategory: { color: colors.text, fontSize: 15, fontWeight: '900' },
  rideDate: { color: colors.textSecondary, fontSize: 9, marginTop: 3 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  routeStem: { width: 1, height: 12, backgroundColor: colors.stroke, marginLeft: 7 },
  routeText: { color: colors.text, flex: 1, fontSize: 12, fontWeight: '600' },
  rideFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.stroke, paddingTop: 10 },
  ridePrice: { color: colors.gold, fontSize: 20, fontWeight: '900' },
  syncInfo: { color: colors.textSecondary, fontSize: 9 },
  events: { borderLeftWidth: 1, borderLeftColor: colors.stroke, marginLeft: 5, gap: 18 },
  event: { flexDirection: 'row', gap: 12, marginLeft: -5 },
  eventDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  eventCopy: { flex: 1, paddingBottom: 4 },
  eventTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  eventDescription: { color: colors.textSecondary, fontSize: 11, lineHeight: 16, marginTop: 2 },
  eventDate: { color: '#70707A', fontSize: 9, marginTop: 4 },
});
