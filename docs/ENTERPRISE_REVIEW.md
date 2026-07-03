# Revisão Enterprise — MotoJá Premium AI Studio

## Objetivo

Revisar o repositório atual do MotoJá e elevar sua estrutura para um padrão mais profissional de produto, tecnologia, operação e marca.

---

## Diagnóstico técnico atual

### Pontos positivos

- Projeto já roda com React + Vite.
- Existe mapa com Leaflet/OpenStreetMap.
- Existe simulação de pilotos via Socket.IO.
- Existe fluxo básico de corrida.
- Existe intenção de arquitetura RIBs.
- Existe PWA básico com service worker.
- Identidade visual dark premium já aparece parcialmente.

### Falhas encontradas

1. **README genérico de AI Studio**
   - Não explicava o produto MotoJá.
   - Não tinha regras de negócio, setup profissional ou roadmap.

2. **Preço mínimo incorreto**
   - O fluxo anterior permitia preço abaixo de R$12.
   - Isso conflita com a regra central da plataforma.

3. **Estados de corrida simplificados demais**
   - Faltavam estados compatíveis com operação real: REQUESTED, MATCHING, ARRIVING, IN_TRIP, CANCELED.

4. **Servidor ainda só simula pilotos**
   - Não há persistência real.
   - Não há autenticação.
   - Não há banco operacional.

5. **Ausência de documentação de agente**
   - Faltavam regras para Codex/Gemini/IA evoluírem o projeto sem bagunçar o padrão.

6. **Design inconsistente**
   - Parte do app usa laranja antigo, enquanto a marca consolidada é dark + gold.

---

## Melhorias aplicadas nesta rodada

- README reescrito com visão de produto.
- AGENTS.md criado para orientar agentes de código.
- Estados de corrida expandidos.
- Lógica de preço revisada para respeitar mínimo R$12.
- Tipos de corrida enriquecidos com categoria, distância e split.
- Documentação de arquitetura adicionada.

---

## Arquitetura recomendada

### Agora

- React/Vite como demo web/PWA.
- Express + Socket.IO para simulação local.
- Estado de corrida mais profissional.
- Documentação clara.

### Próxima fase

- Backend persistente com Firebase.
- Auth.
- Firestore.
- Cloud Functions para preço/corrida.
- FCM para notificação.
- Admin real.

### Fase futura

- Flutter APK.
- Backend autoritativo.
- IA operacional.
- Dashboard de métricas.
- Dispatch inteligente.

---

## Roadmap recomendado

### Fase 1 — Passageiro

- Refinar home.
- Refinar RideFlow.
- Adicionar histórico e perfil reais.
- Adicionar tela de confirmação completa.

### Fase 2 — Piloto

- Criar `/driver`.
- Online/offline.
- Oferta com timer.
- Aceite e conclusão.

### Fase 3 — Admin

- Criar `/admin`.
- Dashboard.
- Rides table.
- Drivers table.
- Pricing controls.

### Fase 4 — Backend real

- Firebase Auth.
- Firestore.
- Cloud Functions.
- Logs imutáveis.
- FCM.

---

## Definição de pronto

O projeto só deve ser considerado pronto para piloto local quando tiver:

- Passageiro navegável.
- Piloto navegável.
- Admin básico.
- Preço mínimo travado.
- Status de corrida coerentes.
- Logs de evento.
- Build sem erro.
- Teste em mobile.
