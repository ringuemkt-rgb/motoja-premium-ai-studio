import type { ConfigContext, ExpoConfig } from 'expo/config';

const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'MotoJá',
  slug: 'motoja-baixo-sul',
  scheme: 'motoja',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  icon: './assets/icon.png',
  android: {
    package: 'br.com.motoja.app',
    versionCode: 1,
    allowBackup: false,
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundColor: '#0B0B0E',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    permissions: [
      'INTERNET',
      'ACCESS_NETWORK_STATE',
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION',
      'FOREGROUND_SERVICE',
      'FOREGROUND_SERVICE_LOCATION',
      'POST_NOTIFICATIONS',
      'CAMERA',
      'VIBRATE',
    ],
    ...(googleMapsApiKey ? { config: { googleMaps: { apiKey: googleMapsApiKey } } } : {}),
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'br.com.motoja.app',
    infoPlist: {
      UIBackgroundModes: ['location', 'remote-notification'],
    },
  },
  plugins: [
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 220,
        resizeMode: 'contain',
        backgroundColor: '#0B0B0E',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission: 'O MotoJá usa sua localização para calcular partidas, destinos e acompanhar a operação.',
        locationAlwaysAndWhenInUsePermission: 'Quando o piloto escolhe ficar online, o MotoJá usa localização em segundo plano para receber e acompanhar serviços.',
        isAndroidBackgroundLocationEnabled: true,
        isIosBackgroundLocationEnabled: true,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#FFC107',
        defaultChannel: 'motoja-operacao',
      },
    ],
    [
      'expo-image-picker',
      {
        cameraPermission: 'O MotoJá usa a câmera para comprovantes de coleta, entrega e verificação.',
        photosPermission: 'O MotoJá acessa fotos somente quando você escolhe anexar um comprovante.',
        microphonePermission: false,
      },
    ],
    ['expo-secure-store', { configureAndroidBackup: true, faceIDPermission: 'Permita autenticação para proteger sua conta MotoJá.' }],
  ],
  extra: {
    apiConfigured: Boolean(process.env.EXPO_PUBLIC_API_URL),
  },
});
