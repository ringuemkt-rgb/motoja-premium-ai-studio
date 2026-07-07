# Repository Cleanup Report — MotoJá

## Objetivo

Organizar, revisar e corrigir o repositório para que ele funcione como uma base mais confiável de construção do aplicativo MotoJá.

---

## Problemas corrigidos

### 1. PWA incompleto

O `index.html` referenciava `manifest.json` e o app registrava `service-worker.js`, mas a configuração precisava ser alinhada à marca e ao build do Vite.

Correções:

- `index.html` atualizado para `pt-BR`.
- `theme-color` ajustado para `#0B0B0E`.
- Manifest PWA revisado.
- Service worker tornado mais seguro para assets gerados pelo Vite.
- Ícone local SVG criado em `public/motoja-icon.svg`.

### 2. Ambiente local confuso

Correção:

- `.env.example` simplificado e alinhado ao MotoJá.

### 3. Falta de CI

Correção:

- Adicionado GitHub Actions em `.github/workflows/ci.yml` com:
  - `npm ci`
  - `npm run lint`
  - `npm run build`

### 4. Falta de contrato de API

Correção:

- Criado `docs/API_CONTRACT.md` documentando os endpoints do servidor demo.

---

## Estado atual

O projeto agora possui:

- documentação mais clara
- instruções para agentes
- PWA mais coerente
- build check automatizado
- contrato de API demo
- identidade visual mais consistente
- estrutura de corrida mais alinhada ao negócio

---

## Próxima rodada recomendada

1. Conectar `RideInteractor` ao endpoint `/api/rides`.
2. Criar telas reais de histórico/perfil.
3. Criar driver module.
4. Criar admin module.
5. Migrar persistência para Firebase ou banco real.
6. Preparar build mobile/PWA testável em Android.
