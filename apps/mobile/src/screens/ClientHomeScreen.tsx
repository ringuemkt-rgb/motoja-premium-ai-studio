import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';

import { Brand, Card, Input, PrimaryButton, Screen, StatusPill } from '../components/ui';
import {
  calculateFare,
  formatBrl,
  ITUBERA_CENTER,
  offsetDestination,
  SERVICE_CATEGORIES,
  type Coordinates,
  type ServiceCategory,
} from '../domain';
import { isApiConfigured, syncQueuedRides } from '../services/api';
import { useMotoJaStore } from '../store/useMotoJaStore';
import { colors, radius, spacing } from '../theme';

const initialRegion: Region = {
  ...ITUBERA_CENTER,
  latitudeDelta: 0.045,
  longitudeDelta: 0.045,
};

const hasGoogleMapsKey = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

export function ClientHomeScreen() {
  const [category, setCategory] = useState<ServiceCategory>('NORMAL');
  const [distanceKm, setDistanceKm] = useState(3.2);
  const [pickupAddress, setPickupAddress] = useState('Minha localização');
  const [dropoffAddress, setDropoffAddress] = useState('Centro de Ituberá');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [pickupPhotoUri, setPickupPhotoUri] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates>(ITUBERA_CENTER);
  const [submitting, setSubmitting] = useState(false);
  const enqueueRide = useMotoJaStore((state) => state.enqueueRide);
  const latestRide = useMotoJaStore((state) => state.rides[0]);

  const quote = useMemo(() => calculateFare(category, distanceKm * 1000), [category, distanceKm]);
  const destination = useMemo(() => offsetDestination(currentLocation, distanceKm * 1000), [currentLocation, distanceKm]);
  const deliveryMode = category === 'DELIVERY' || category === 'PHARMACY';

  useEffect(() => {
    void (async () => {
      const permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null);
      if (location) setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    })();
  }, []);

  const capturePickupPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Câmera necessária', 'Autorize a câmera para registrar a coleta.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.72 });
    if (!result.canceled) setPickupPhotoUri(result.assets[0]?.uri ?? null);
  };

  const requestRide = async () => {
    if (!pickupAddress.trim() || !dropoffAddress.trim()) {
      Alert.alert('Confira a rota', 'Informe o ponto de partida e o destino.');
      return;
    }
    if (deliveryMode && !pickupPhotoUri) {
      Alert.alert('Foto da coleta', 'Registre a foto da coleta antes de solicitar a entrega.');
      return;
    }

    setSubmitting(true);
    try {
      const id = Crypto.randomUUID();
      const now = new Date().toISOString();
      enqueueRide({
        id,
        idempotencyKey: Crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        category,
        status: 'QUEUED_OFFLINE',
        pickupAddress: pickupAddress.trim(),
        dropoffAddress: dropoffAddress.trim(),
        pickup: currentLocation,
        dropoff: destination,
        quote,
        pickupPhotoUri,
        deliveryNotes: deliveryNotes.trim() || null,
        remoteId: null,
        syncAttempts: 0,
        proof: null,
      });

      const summary = await syncQueuedRides();
      await Notifications.requestPermissionsAsync().catch(() => undefined);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: summary.synced > 0 ? 'Pedido enviado ao MotoJá' : 'Pedido guardado com segurança',
          body: summary.synced > 0 ? 'A central já está procurando um piloto.' : 'Ele será sincronizado quando a central estiver disponível.',
        },
        trigger: null,
      }).catch(() => undefined);

      setPickupPhotoUri(null);
      setDeliveryNotes('');
      Alert.alert(
        summary.synced > 0 ? 'Pedido enviado' : 'Pedido salvo no aparelho',
        summary.synced > 0
          ? 'Acompanhe o andamento em Atividade.'
          : 'O modo offline-first preservou o pedido. Configure a API para sincronização real.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Brand />
        <View style={styles.headerRight}>
          <StatusPill label={isApiConfigured() ? 'CENTRAL CONFIGURADA' : 'MODO LOCAL'} tone={isApiConfigured() ? 'success' : 'warning'} />
        </View>
      </View>

      <View style={styles.greeting}>
        <View>
          <Text style={styles.hello}>Olá! Para onde vamos?</Text>
          <Text style={styles.city}>Ituberá e Baixo Sul da Bahia</Text>
        </View>
        <View style={styles.avatar}><Ionicons name="person" size={20} color={colors.gold} /></View>
      </View>

      <View style={styles.mapCard}>
        {hasGoogleMapsKey ? (
          <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion} region={{ ...currentLocation, latitudeDelta: 0.045, longitudeDelta: 0.045 }} showsCompass={false} toolbarEnabled={false}>
            <Marker coordinate={currentLocation} title="Partida" pinColor={colors.gold} />
            <Marker coordinate={destination} title="Destino" pinColor={colors.success} />
            <Polyline coordinates={[currentLocation, destination]} strokeColor={colors.gold} strokeWidth={4} lineDashPattern={[12, 7]} />
          </MapView>
        ) : (
          <View style={styles.mapFallback} accessibilityLabel="Prévia de rota disponível sem mapa online">
            <View style={[styles.mapGrid, styles.mapGridOne]} />
            <View style={[styles.mapGrid, styles.mapGridTwo]} />
            <View style={styles.fallbackRoute}>
              <View style={styles.fallbackPoint}><Ionicons name="radio-button-on" color={colors.gold} size={22} /></View>
              <View style={styles.fallbackLine} />
              <View style={styles.fallbackPoint}><Ionicons name="location" color={colors.success} size={24} /></View>
            </View>
            <View style={styles.fallbackCopy}>
              <Text style={styles.fallbackTitle}>Prévia offline da rota</Text>
              <Text style={styles.fallbackText}>Adicione a chave Google Maps para exibir o mapa detalhado.</Text>
            </View>
          </View>
        )}
        <View style={styles.mapBadge}><Ionicons name="shield-checkmark" color={colors.success} size={15} /><Text style={styles.mapBadgeText}>Rota protegida</Text></View>
      </View>

      {latestRide ? (
        <Card style={styles.latestCard}>
          <View style={styles.latestTop}><Text style={styles.latestLabel}>ÚLTIMO PEDIDO</Text><StatusPill label={latestRide.status.replaceAll('_', ' ')} tone={latestRide.status === 'SYNC_ERROR' ? 'error' : latestRide.status === 'QUEUED_OFFLINE' ? 'warning' : 'info'} /></View>
          <Text style={styles.latestRoute} numberOfLines={1}>{latestRide.pickupAddress} → {latestRide.dropoffAddress}</Text>
        </Card>
      ) : null}

      <Text style={styles.fieldLabel}>ESCOLHA O SERVIÇO</Text>
      <View style={styles.categories}>
        {SERVICE_CATEGORIES.map((item) => {
          const selected = category === item.code;
          return (
            <Pressable key={item.code} onPress={() => setCategory(item.code)} style={[styles.category, selected && styles.categorySelected]}>
              <Ionicons name={item.code === 'NORMAL' ? 'bicycle' : item.code === 'EXPRESS' ? 'flash' : item.code === 'DELIVERY' ? 'cube' : 'medkit'} size={21} color={selected ? colors.black : colors.gold} />
              <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{item.shortLabel}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={styles.routeCard}>
        <Input label="PARTIDA" icon="radio-button-on" value={pickupAddress} onChangeText={setPickupAddress} />
        <View style={styles.routeLine} />
        <Input label="DESTINO" icon="location" value={dropoffAddress} onChangeText={setDropoffAddress} />
        {deliveryMode ? (
          <>
            <Input label="DETALHES DA ENTREGA" icon="document-text" value={deliveryNotes} onChangeText={setDeliveryNotes} placeholder="Pedido, referência e cuidado necessário" multiline />
            <PrimaryButton label={pickupPhotoUri ? 'Foto da coleta registrada' : 'Fotografar coleta'} onPress={capturePickupPhoto} variant="outline" icon={pickupPhotoUri ? 'checkmark-circle' : 'camera'} />
          </>
        ) : null}
      </Card>

      <Card style={styles.quoteCard}>
        <View style={styles.distanceHeader}><Text style={styles.distanceLabel}>Distância estimada</Text><Text style={styles.distanceValue}>{distanceKm.toFixed(1).replace('.', ',')} km</Text></View>
        <Slider minimumValue={1} maximumValue={25} step={0.5} value={distanceKm} onValueChange={setDistanceKm} minimumTrackTintColor={colors.gold} maximumTrackTintColor={colors.stroke} thumbTintColor={colors.gold} />
        <View style={styles.quoteDivider} />
        <View style={styles.quoteRow}>
          <View><Text style={styles.quoteLabel}>VOCÊ PAGA</Text><Text style={styles.quoteValue}>{formatBrl(quote.totalCents)}</Text></View>
          <View style={styles.quoteRight}><Text style={styles.quoteLabel}>PILOTO RECEBE</Text><Text style={styles.driverValue}>{formatBrl(quote.driverEarningsCents)}</Text></View>
        </View>
        <Text style={styles.quoteNote}>Valor calculado em centavos e exibido antes da confirmação. Tarifa mínima regional: R$ 12,00.</Text>
      </Card>

      <PrimaryButton label={deliveryMode ? 'Solicitar entrega' : 'Confirmar corrida'} onPress={requestRide} loading={submitting} icon="arrow-forward" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  headerRight: { alignItems: 'flex-end' },
  greeting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  hello: { color: colors.text, fontSize: 23, fontWeight: '900', letterSpacing: -0.7 },
  city: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.stroke, alignItems: 'center', justifyContent: 'center' },
  mapCard: { height: 240, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.stroke, marginBottom: spacing.lg, backgroundColor: colors.surface },
  mapFallback: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mapGrid: { position: 'absolute', width: 360, height: 1, backgroundColor: `${colors.textSecondary}12`, transform: [{ rotate: '-28deg' }] },
  mapGridOne: { top: 62, left: -54 },
  mapGridTwo: { bottom: 42, right: -66 },
  fallbackRoute: { flexDirection: 'row', alignItems: 'center', width: '64%', marginBottom: 24 },
  fallbackPoint: { width: 38, height: 38, borderRadius: 15, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.stroke, alignItems: 'center', justifyContent: 'center' },
  fallbackLine: { flex: 1, height: 3, backgroundColor: colors.gold, opacity: 0.75, marginHorizontal: -2 },
  fallbackCopy: { alignItems: 'center', paddingHorizontal: 24 },
  fallbackTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  fallbackText: { color: colors.textSecondary, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 4 },
  mapBadge: { position: 'absolute', left: 12, top: 12, flexDirection: 'row', gap: 6, borderRadius: radius.pill, backgroundColor: '#0B0B0EDD', borderWidth: 1, borderColor: `${colors.success}55`, paddingHorizontal: 10, paddingVertical: 7, alignItems: 'center' },
  mapBadgeText: { color: colors.text, fontSize: 10, fontWeight: '800' },
  latestCard: { padding: 13, marginBottom: spacing.lg, gap: 8 },
  latestTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  latestLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  latestRoute: { color: colors.text, fontSize: 13, fontWeight: '700' },
  fieldLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginBottom: 9 },
  categories: { flexDirection: 'row', gap: 8, marginBottom: spacing.lg },
  category: { flex: 1, minHeight: 66, borderRadius: radius.md, borderWidth: 1, borderColor: colors.stroke, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 5 },
  categorySelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  categoryText: { color: colors.textSecondary, fontSize: 10, fontWeight: '800' },
  categoryTextSelected: { color: colors.black },
  routeCard: { gap: 13, marginBottom: spacing.md },
  routeLine: { position: 'absolute', left: 31, top: 76, width: 1, height: 28, backgroundColor: colors.stroke },
  quoteCard: { marginBottom: spacing.lg },
  distanceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  distanceLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  distanceValue: { color: colors.gold, fontSize: 15, fontWeight: '900' },
  quoteDivider: { height: 1, backgroundColor: colors.stroke, marginVertical: spacing.md },
  quoteRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quoteRight: { alignItems: 'flex-end' },
  quoteLabel: { color: colors.textSecondary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  quoteValue: { color: colors.text, fontSize: 29, fontWeight: '900', letterSpacing: -1, marginTop: 3 },
  driverValue: { color: colors.success, fontSize: 18, fontWeight: '900', marginTop: 7 },
  quoteNote: { color: colors.textSecondary, fontSize: 10, lineHeight: 15, marginTop: spacing.md },
});
