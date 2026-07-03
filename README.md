# MotoJá Premium AI Studio 🏍️

Aplicativo web/mobile-first para demonstração operacional da **MotoJá**, plataforma regional de mobilidade, mototáxi, entregas rápidas, farmácia e logística local para **Ituberá-BA** e Baixo Sul da Bahia.

Este repositório nasceu no Google AI Studio, mas foi reorganizado para seguir uma linha mais profissional de produto: **experiência do passageiro, operação do piloto, painel administrativo, backend autoritativo e inteligência operacional**.

---

## Objetivo

Construir uma base testável, bonita e evolutiva do MotoJá, com padrão visual premium semelhante a apps grandes de mobilidade, mas adaptada ao mercado local.

A proposta central da marca:

> **Mobilidade local com padrão profissional.**

---

## Stack atual

- React 19
- Vite
- TypeScript
- TailwindCSS v4
- Leaflet / OpenStreetMap
- Socket.IO para simulação em tempo real
- Express para API local
- Motion / Framer-style animation
- Lucide React

---

## Regras de negócio centrais

- Corrida mínima: **R$ 12,00**
- Split financeiro:
  - **20% plataforma**
  - **80% piloto**
- Categorias:
  - MotoJá Normal
  - MotoJá Expresso
  - Entrega
  - Farmácia
- Região piloto: **Ituberá-BA**

---

## Arquitetura recomendada para produção

A versão atual é uma base web/PWA demonstrável. Para produção real, a arquitetura recomendada é:

1. **Flutter** para passageiro e piloto.
2. **Firebase Auth** para autenticação.
3. **Cloud Firestore** como banco operacional.
4. **Cloud Functions** para lógica autoritativa de preço, corrida e repasse.
5. **FCM** para notificações.
6. **Google Maps/OpenStreetMap** para mapas.
7. **Crashlytics, Analytics e Remote Config** para observabilidade.
8. Backend sidecar opcional para IA operacional quando houver tração real.

---

## Rodar localmente

**Pré-requisito:** Node.js 20+

```bash
npm install
npm run dev
```

Depois abra:

```text
http://localhost:3000
```

---

## Scripts

```bash
npm run dev       # inicia servidor Express + Vite
npm run build     # build de produção
npm run preview   # preview Vite
npm run lint      # checagem TypeScript
npm run clean     # remove dist
```

---

## Estrutura principal

```text
src/
  App.tsx
  components/
    Map.tsx
    RideFlow.tsx
    AICentral.tsx
    VisualStudio.tsx
  ribs/
    ride/
      interactor.ts
      types.ts
  utils/
server.ts
docs/
AGENTS.md
```

---

## O que foi revisado nesta fase

- Padronização de regras de negócio do MotoJá.
- Correção de preço mínimo para R$12.
- Estruturação do fluxo de corrida com estados compatíveis com operação real.
- Organização de documentação técnica.
- Inclusão de diretrizes para agentes de IA/Codex.
- Preparação para evolução em backend autoritativo.

---

## Próximas prioridades

1. Fechar fluxo do passageiro.
2. Criar área do piloto.
3. Criar admin operacional.
4. Integrar backend persistente.
5. Adicionar notificações.
6. Preparar versão APK/PWA instalável.

---

## Importante

Este repositório ainda é uma base técnica/demo. Não deve ser anunciado como sistema de produção equivalente à Uber. O caminho correto é evoluir por fases: MVP local, operação piloto, backend real, monitoramento, depois escala.