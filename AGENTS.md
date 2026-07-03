# AGENTS.md — MotoJá

## Missão

Este repositório deve ser evoluído como base profissional do aplicativo **MotoJá**, plataforma regional de mototáxi, entregas rápidas, farmácia e logística local para Ituberá-BA e Baixo Sul.

O objetivo não é criar um clone literal da Uber, mas sim aplicar boas práticas de plataformas de mobilidade em um produto regional, escalável por fases e financeiramente sustentável.

---

## Regras de negócio fixas

- Corrida mínima: **R$ 12,00**
- Plataforma: **20%**
- Piloto: **80%**
- Dinheiro em produção deve ser tratado em **centavos inteiros**, nunca em float.
- Categorias oficiais:
  - MotoJá Normal
  - MotoJá Expresso
  - Entrega
  - Farmácia

---

## Marca

### Posicionamento

**A mobilidade inteligente, confiável e premium da nossa região.**

### Arquétipos

- Herói
- Governante
- Cuidador
- Sábio

### Paleta oficial

- `#0B0B0E` background
- `#15151A` surface
- `#1E1E26` surface secondary
- `#25252D` stroke
- `#FFC107` gold primary
- `#D4AF37` gold support
- `#FFD86B` gold light
- `#B8860B` gold dark
- `#FFFFFF` text primary
- `#B8B8C2` text secondary
- `#3DDC97` success
- `#FF4D4D` error
- `#4A90E2` verification

---

## Produto

Prioridade fixa:

1. Passageiro
2. Piloto
3. Admin
4. Backend autoritativo
5. IA operacional
6. Growth/local partnerships

---

## Estados de corrida

Usar preferencialmente estes estados:

- `IDLE`
- `REQUESTED`
- `MATCHING`
- `ACCEPTED`
- `ARRIVING`
- `IN_TRIP`
- `COMPLETED`
- `CANCELED`

---

## Regras técnicas

- Não deixar preço final confiado apenas ao cliente.
- No demo, cálculo local é aceitável, mas deve sinalizar que o backend precisa autorizar.
- Sempre separar UI, regra de negócio, estado e integração.
- Evitar TODOs vazios.
- Manter TypeScript rigoroso e componentes reutilizáveis.
- Priorizar acessibilidade, legibilidade e mobile-first.

---

## Qualidade visual

O app deve parecer:

- premium
- seguro
- local
- rápido
- claro
- profissional

Evitar:

- visual genérico
- excesso de laranja fora da paleta gold
- fluxo confuso
- muitos CTAs concorrentes
- promessas técnicas não implementadas

---

## Padrão de resposta para agentes

Sempre que um agente modificar este projeto, deve reportar:

1. Objetivo
2. Arquivos alterados
3. Risco reduzido
4. Próximo passo técnico
