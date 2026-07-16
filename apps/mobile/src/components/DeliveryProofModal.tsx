import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, View } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { DeliveryProof } from '../domain';
import { colors, radius, spacing } from '../theme';
import { Input, PrimaryButton } from './ui';

export function DeliveryProofModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (proof: DeliveryProof) => void;
}) {
  const [recipientName, setRecipientName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const captureDeliveryPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Câmera necessária', 'Autorize a câmera para registrar a entrega.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) setPhotoUri(result.assets[0]?.uri ?? null);
  };

  const handleSignature = async (signatureData: string) => {
    if (!recipientName.trim()) {
      Alert.alert('Nome necessário', 'Informe quem recebeu a entrega antes de confirmar a assinatura.');
      return;
    }
    setSaving(true);
    try {
      const signatureHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, signatureData);
      onSave({
        recordedAt: new Date().toISOString(),
        recipientName: recipientName.trim(),
        signatureHash,
        photoUri,
      });
      setRecipientName('');
      setPhotoUri(null);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>ENTREGA B2B</Text>
            <Text style={styles.title}>Comprovante digital</Text>
          </View>
          <View style={styles.close}><PrimaryButton label="Fechar" onPress={onClose} variant="outline" /></View>
        </View>

        <Text style={styles.description}>Registre o nome, a foto opcional e a assinatura de quem recebeu. O app guarda apenas o hash da assinatura no estado local.</Text>

        <Input label="NOME DE QUEM RECEBEU" icon="person" value={recipientName} onChangeText={setRecipientName} placeholder="Nome completo" />

        <View style={styles.photoRow}>
          {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : <View style={styles.photoPlaceholder}><Text style={styles.photoPlaceholderText}>Sem foto</Text></View>}
          <View style={styles.photoAction}><PrimaryButton label={photoUri ? 'Refazer foto' : 'Foto da entrega'} onPress={captureDeliveryPhoto} variant="outline" icon="camera" /></View>
        </View>

        <Text style={styles.signatureLabel}>ASSINATURA NA TELA</Text>
        <View style={styles.signatureShell}>
          <SignatureCanvas
            onOK={handleSignature}
            onEmpty={() => Alert.alert('Assinatura vazia', 'Peça ao recebedor para assinar no quadro.')}
            descriptionText="Assine com o dedo"
            clearText="Limpar"
            confirmText={saving ? 'Salvando…' : 'Confirmar assinatura'}
            webStyle={signatureWebStyle}
            backgroundColor="#FFFFFF"
            penColor="#0B0B0E"
            autoClear={false}
          />
        </View>
        <Text style={styles.securityNote}>SHA-256 • timestamp • recebedor • foto opcional</Text>
      </SafeAreaView>
    </Modal>
  );
}

const signatureWebStyle = `
  .m-signature-pad { box-shadow: none; border: none; }
  .m-signature-pad--body { border: none; }
  .m-signature-pad--footer { margin: 10px 12px 8px; }
  .m-signature-pad--footer .description { color: #555; font-family: sans-serif; }
  button { background: #FFC107 !important; color: #0B0B0E !important; border: 0 !important; border-radius: 10px !important; padding: 10px 16px !important; font-weight: 800 !important; }
`;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.md },
  eyebrow: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 3 },
  close: { width: 90 },
  description: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: spacing.lg },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: spacing.lg },
  photo: { width: 82, height: 72, borderRadius: radius.md },
  photoPlaceholder: { width: 82, height: 72, borderRadius: radius.md, borderWidth: 1, borderColor: colors.stroke, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderText: { color: colors.textSecondary, fontSize: 10 },
  photoAction: { flex: 1 },
  signatureLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 8 },
  signatureShell: { flex: 1, minHeight: 280, backgroundColor: colors.text, borderRadius: radius.md, overflow: 'hidden', borderWidth: 2, borderColor: colors.gold },
  securityNote: { color: colors.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 10 },
});
