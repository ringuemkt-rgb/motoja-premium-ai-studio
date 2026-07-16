# API Contract — MotoJá Demo Server

## Objetivo

Documentar os endpoints locais atuais para que o app deixe de ser apenas visual e passe a ter um fluxo operacional simulável.

> Produção real deve persistir essas ações no backend Fastify/PostgreSQL/PostGIS, com autenticação, autorização, transações e auditoria.

---

## GET `/api/health`

Retorna saúde do servidor.

```json
{
  "status": "ok",
  "product": "MotoJá",
  "region": "Ituberá-BA"
}
```

---

## GET `/api/drivers/active`

Lista pilotos simulados ativos.

```json
{
  "drivers": [
    {
      "id": "moto-001",
      "lat": -13.7288,
      "lng": -39.1494,
      "type": "available",
      "name": "Carlos MotoJá",
      "rating": 4.95,
      "vehicle": "Honda CG 160",
      "plate": "JQX-2026"
    }
  ]
}
```

---

## POST `/api/rides`

Cria corrida demo com regra de preço mínimo, split 20/80 e deduplicação por idempotência.

### Header

```http
Idempotency-Key: 53c5296c-bf50-4b53-8f3d-ef9f8b378418
```

Repetir a chamada com a mesma chave retorna a corrida já criada, sem duplicar o pedido.

### Body

```json
{
  "localId": "f53a2201-b6c8-48e8-b742-80ab16573b57",
  "category": "NORMAL",
  "pickupAddress": "Centro de Ituberá-BA",
  "dropoffAddress": "Praça Central",
  "pickup": { "latitude": -13.7288, "longitude": -39.1494 },
  "dropoff": { "latitude": -13.731, "longitude": -39.145 },
  "quote": {
    "distanceMeters": 2500,
    "totalCents": 1200,
    "platformFeeCents": 240,
    "driverEarningsCents": 960
  }
}
```

### Regras

- `priceCents >= 1200`
- `platformFeeCents = 20%`
- `driverEarningCents = 80%`
- o servidor recalcula preço e split; não aceita os valores financeiros do cliente como autoridade
- categorias aceitas: `NORMAL`, `EXPRESS`, `DELIVERY`, `PHARMACY`

---

## POST `/api/rides/:rideId/accept`

Aceita corrida demo.

```json
{
  "driverId": "moto-001"
}
```

---

## POST `/api/rides/:rideId/status`

Atualiza status da corrida.

Status aceitos:

- `ARRIVING`
- `IN_TRIP`
- `COMPLETED`
- `CANCELED`

```json
{
  "status": "IN_TRIP",
  "actorId": "moto-001"
}
```

---

## GET `/api/rides`

Lista corridas em memória.

---

## GET `/api/rides/:rideId/events`

Lista eventos da corrida.

Eventos funcionam como simulação de trilha imutável para auditoria.
