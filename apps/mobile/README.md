# MotoJá Android — Expo SDK 57

Aplicativo nativo de teste para cliente e piloto parceiro, com React Native 0.86, TypeScript 6 e Expo SDK 57.

## Funcionalidades do APK

- escolha de perfil cliente/piloto;
- aceite dos termos e LGPD com IP disponível, timestamp, localização, dispositivo e SHA-256;
- quatro categorias com preço em centavos, mínimo de R$ 12,00 e split 20/80;
- fila offline persistida e sincronização idempotente;
- mapa, corrida, entrega e farmácia;
- foto da coleta, assinatura na tela e comprovante por hash;
- piloto online/offline, recusa sem penalidade e localização em background;
- checklist de CNH, Seguro APP, antecedentes e EPI;
- notificações locais e trilha de auditoria no aparelho.

## Instalação

```bash
cd apps/mobile
npm ci
cp .env.example .env.local
npm test
npm run typecheck
```

## Executar

```bash
npm start
```

Background location, notificações e algumas permissões exigem development build ou APK; não são integralmente testáveis no Expo Go.

## APK de teste pelo EAS

```bash
npx eas-cli@21.0.1 login
npx eas-cli@21.0.1 init
npm run apk:eas
```

O perfil `preview` em `eas.json` gera APK instalável. O EAS cria e administra o keystore Android quando solicitado.

## AAB de produção

```bash
npm run aab:eas
```

Antes do release, configure `EXPO_PUBLIC_API_URL`, restrinja a chave Maps ao package `br.com.motoja.app`, conecte OTP/Pix/storage privado e execute o checklist jurídico e operacional.

## Build local Android

Requer JDK 17 completo, Android SDK e `ANDROID_HOME`.

```bash
npm run prebuild:android
npm run apk:local
npm run apk:preview:local
```

Saída:

```text
apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk
apps/mobile/android/app/build/outputs/apk/release/app-release.apk
```

O `debug` depende do Metro para desenvolvimento. O `release` local contém o bundle e é instalável sem Metro, mas usa a chave de debug gerada pelo template: trate-o apenas como homologação. O APK/AAB de produção deve ser assinado pelo EAS com a keystore definitiva.

## Chave Google Maps

Sem `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`, o app exibe uma prévia de rota offline em vez de uma tela vazia. Para ativar o mapa:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_publica_restrita
```

Restrinja a chave ao package `br.com.motoja.app` e ao SHA-1/SHA-256 do certificado usado em cada ambiente.
