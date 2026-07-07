# API Contract — MotoJá Demo Server

## Objetivo

Documentar os endpoints locais atuais para que o app deixe de ser apenas visual e passe a ter um fluxo operacional simulável.

> Produção real deve migrar essas ações para backend autoritativo, preferencialmente Cloud Functions/Firebase.

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

Cria corrida demo com regra de preço mínimo e split 20/80.

### Body

```json
{
  "passengerId": "demo-passenger",
  "category": "MotoJá Normal",
  "origin": { "address": "Centro de Ituberá-BA", "lat": -13.7288, "lng": -39.1494 },
  "destination": { "address": "Praça Central", "lat": -13.731, "lng": -39.145 },
  "distanceKm": 2.5
}
```

### Regras

- `priceCents >= 1200`
- `platformFeeCents = 20%`
- `driverEarningCents = 80%`

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
