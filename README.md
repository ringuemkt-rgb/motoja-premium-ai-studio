# MotoJá — mobilidade e entregas no Baixo Sul

Base oficial do **MotoJá**, plataforma regional de mototáxi, entregas, farmácia e logística local para Ituberá, Nilo Peçanha, Valença e municípios do Baixo Sul da Bahia.

O repositório contém dois produtos executáveis:

- `apps/mobile`: aplicativo Android oficial em React Native, Expo SDK 57 e TypeScript;
- raiz do projeto: site/PWA institucional e demonstração operacional em React + Vite, com API Express/Socket.IO local.

> MVP de homologação. Cobrança Pix, autenticação OTP, KYC documental e custódia de evidências ainda precisam de provedores reais antes da operação pública.

## Regras canônicas

- corrida mínima: **R$ 12,00** (`1200` centavos);
- plataforma: **20%**;
- piloto parceiro: **80%**;
- categorias: MotoJá Normal, MotoJá Expresso, Entrega e Farmácia;
- região piloto: Ituberá e Baixo Sul da Bahia.

Dinheiro é tratado em centavos inteiros. O backend recalcula valores recebidos e mutações de corrida usam chave de idempotência.

## Aplicativo Android

O APK atual oferece:

- perfis de cliente e piloto parceiro;
- aceite de Termos/LGPD com timestamp, IP disponível, geolocalização autorizada, dispositivo e SHA-256;
- transparência de preço e split antes da confirmação;
- fila offline persistida com sincronização idempotente;
- quatro categorias regionais;
- entrega B2B com foto da coleta, assinatura e hash de comprovante;
- online/offline escolhido pelo piloto, aceite e recusa sem punição automática;
- localização em segundo plano somente durante disponibilidade operacional;
- checklist de CNH, Seguro APP, antecedentes e EPI;
- notificações contextuais, histórico e auditoria local;
- fallback visual quando a chave Google Maps não estiver configurada.

### Executar o mobile

```bash
cd apps/mobile
npm ci
cp .env.example .env.local
npm test
npm run typecheck
npm start
```

Para permissões nativas e background location, use development build ou APK; o Expo Go não cobre todo o fluxo.

### APK/AAB pelo EAS

```bash
cd apps/mobile
npx eas-cli@21.0.1 login
npx eas-cli@21.0.1 init
npm run apk:eas
npm run aab:eas
```

- `preview`: APK interno instalável;
- `production`: AAB assinado para Google Play.

O EAS deve custodiar a keystore de produção. Nunca versione `.jks`, tokens ou credenciais de serviço.

Mais detalhes: [`apps/mobile/README.md`](apps/mobile/README.md).

## Site e API local

Pré-requisito: Node.js 22.

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`.

Endpoints principais:

- `GET /api/health`
- `GET /api/drivers/active`
- `POST /api/rides` com `Idempotency-Key`
- `POST /api/rides/:rideId/accept`
- `POST /api/rides/:rideId/status`
- `GET /api/rides`
- `GET /api/rides/:rideId/events`

O contrato da demonstração está em [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md).

## Validação

```bash
npm run check
npm run mobile:test
npm run mobile:typecheck
npm run mobile:export
```

Ou execute tudo:

```bash
npm run check:all
```

O GitHub Actions valida site/API e mobile em jobs separados com Node.js 22.

## Configuração pública do app

Crie `apps/mobile/.env.local` a partir do exemplo:

```env
EXPO_PUBLIC_API_URL=https://api.seu-dominio.com.br
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_publica_restrita
```

Restrinja a chave Maps ao package `br.com.motoja.app` e aos certificados corretos. Segredos de banco, JWT, HMAC, Pix e storage pertencem exclusivamente ao backend/EAS secret manager.

## Estrutura

```text
apps/mobile/                 Expo + React Native Android
  src/components/           UI e comprovante de entrega
  src/screens/              cliente, piloto, termos, atividade e perfil
  src/services/             API offline e localização em background
  src/store/                Zustand + AsyncStorage
  app.config.ts             identidade e permissões nativas
  eas.json                   debug, preview APK e production AAB
src/                        site/PWA React
server.ts                   API Express + Socket.IO de demonstração
docs/                       contratos e decisões
.github/workflows/ci.yml    gates automatizados
```

## Limites antes de produção

Para operação pública ainda são obrigatórios: autenticação real, PostgreSQL/PostGIS, storage privado de documentos/fotos, Pix homologado, antifraude, painel de suporte, observabilidade, política de privacidade publicada, revisão jurídica e testes em aparelhos físicos com rede fraca e otimização de bateria.
