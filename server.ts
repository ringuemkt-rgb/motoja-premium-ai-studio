import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MINIMUM_FARE_CENTS = 1200;
const PLATFORM_FEE_PERCENT = 0.2;
const FARE_RULES: Record<string, { baseCents: number; perKmCents: number }> = {
  NORMAL: { baseCents: 500, perKmCents: 220 },
  EXPRESS: { baseCents: 650, perKmCents: 275 },
  DELIVERY: { baseCents: 700, perKmCents: 240 },
  PHARMACY: { baseCents: 750, perKmCents: 250 },
};

interface DriverPosition {
  id: string;
  lat: number;
  lng: number;
  type: "available" | "delivery" | "busy";
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
}

interface RideRecord {
  id: string;
  status: "REQUESTED" | "MATCHING" | "ACCEPTED" | "ARRIVING" | "IN_TRIP" | "COMPLETED" | "CANCELED";
  passengerId: string;
  driverId: string | null;
  category: string;
  origin: { address: string; lat: number; lng: number };
  destination: { address: string; lat: number; lng: number };
  distanceKm: number;
  priceCents: number;
  platformFeeCents: number;
  driverEarningCents: number;
  requestedAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
}

const normalizeCategory = (category: string) => {
  const normalized = category.trim().toUpperCase();
  if (normalized.includes("EXPRESS")) return "EXPRESS";
  if (normalized.includes("FARM")) return "PHARMACY";
  if (normalized.includes("ENTREGA") || normalized.includes("DELIVERY")) return "DELIVERY";
  return "NORMAL";
};

const fareFor = (distanceKm: number, category: string) => {
  const categoryCode = normalizeCategory(category);
  const rule = FARE_RULES[categoryCode] ?? FARE_RULES.NORMAL;
  const safeDistanceKm = Math.max(0, Number.isFinite(distanceKm) ? distanceKm : 0);
  const calculated = rule.baseCents + Math.round(safeDistanceKm * rule.perKmCents);
  const priceCents = Math.max(MINIMUM_FARE_CENTS, calculated);
  const platformFeeCents = Math.round(priceCents * PLATFORM_FEE_PERCENT);
  return {
    priceCents,
    platformFeeCents,
    driverEarningCents: priceCents - platformFeeCents,
  };
};

async function startServer() {
  const app = express();
  app.use(express.json());

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = Number(process.env.PORT || 3000);

  // Ituberá-BA center-ish coordinates for local demo.
  let drivers: DriverPosition[] = [
    { id: "moto-001", lat: -13.7288, lng: -39.1494, type: "available", name: "Carlos MotoJá", rating: 4.95, vehicle: "Honda CG 160", plate: "JQX-2026" },
    { id: "moto-002", lat: -13.731, lng: -39.145, type: "delivery", name: "Marcos Oliveira", rating: 4.9, vehicle: "Yamaha Fazer 250", plate: "MJA-1020" },
    { id: "moto-003", lat: -13.7265, lng: -39.151, type: "available", name: "Rafael Santos", rating: 4.87, vehicle: "Honda Biz 125", plate: "ITB-2201" },
    { id: "moto-004", lat: -13.733, lng: -39.147, type: "available", name: "Lucas Silva", rating: 4.91, vehicle: "Honda Pop 110i", plate: "BSB-8841" },
  ];

  const rides = new Map<string, RideRecord>();
  const rideIdempotency = new Map<string, string>();
  const rideEvents: Array<{ rideId: string; type: string; actorId: string; createdAt: string }> = [];

  setInterval(() => {
    drivers = drivers.map((d) => ({
      ...d,
      lat: d.lat + (Math.random() - 0.5) * 0.00045,
      lng: d.lng + (Math.random() - 0.5) * 0.00045,
    }));
    io.emit("drivers_update", drivers);
  }, 2000);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.emit("drivers_update", drivers);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", product: "MotoJá", region: "Ituberá-BA" });
  });

  app.get("/api/drivers/active", (_req, res) => {
    res.json({ drivers });
  });

  app.post("/api/rides", (req, res) => {
    const idempotencyKey = req.header("Idempotency-Key")?.trim();
    if (idempotencyKey) {
      const existingId = rideIdempotency.get(idempotencyKey);
      const existingRide = existingId ? rides.get(existingId) : null;
      if (existingRide) return res.status(200).json(existingRide);
    }

    const {
      passengerId = "demo-passenger",
      category = "NORMAL",
      pickupAddress,
      dropoffAddress,
      pickup,
      dropoff,
      origin = pickup
        ? { address: pickupAddress ?? "Partida", lat: pickup.latitude, lng: pickup.longitude }
        : { address: "Centro de Ituberá-BA", lat: -13.7288, lng: -39.1494 },
      destination = dropoff
        ? { address: dropoffAddress ?? "Destino", lat: dropoff.latitude, lng: dropoff.longitude }
        : { address: "Praça Central", lat: -13.731, lng: -39.145 },
      distanceKm = 2.5,
      quote,
    } = req.body ?? {};

    const authoritativeDistanceKm = quote?.distanceMeters != null
      ? Number(quote.distanceMeters) / 1000
      : Number(distanceKm);
    const categoryCode = normalizeCategory(String(category));
    const financials = fareFor(authoritativeDistanceKm, categoryCode);
    const rideId = `ride-${Date.now()}`;
    const now = new Date().toISOString();
    const ride: RideRecord = {
      id: rideId,
      status: "REQUESTED",
      passengerId,
      driverId: null,
      category: categoryCode,
      origin,
      destination,
      distanceKm: authoritativeDistanceKm,
      ...financials,
      requestedAt: now,
      acceptedAt: null,
      completedAt: null,
    };

    rides.set(rideId, ride);
    if (idempotencyKey) rideIdempotency.set(idempotencyKey, rideId);
    rideEvents.push({ rideId, type: "RIDE_REQUESTED", actorId: passengerId, createdAt: now });
    io.emit("ride_created", ride);
    res.status(201).json(ride);
  });

  app.post("/api/rides/:rideId/accept", (req, res) => {
    const ride = rides.get(req.params.rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    const driverId = req.body?.driverId ?? drivers[0]?.id;
    ride.status = "ACCEPTED";
    ride.driverId = driverId;
    ride.acceptedAt = new Date().toISOString();
    rides.set(ride.id, ride);
    rideEvents.push({ rideId: ride.id, type: "RIDE_ACCEPTED", actorId: driverId, createdAt: ride.acceptedAt });
    io.emit("ride_updated", ride);
    res.json(ride);
  });

  app.post("/api/rides/:rideId/status", (req, res) => {
    const ride = rides.get(req.params.rideId);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    const status = req.body?.status;
    if (!["ARRIVING", "IN_TRIP", "COMPLETED", "CANCELED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    ride.status = status;
    if (status === "COMPLETED") ride.completedAt = new Date().toISOString();
    rides.set(ride.id, ride);
    rideEvents.push({ rideId: ride.id, type: `RIDE_${status}`, actorId: req.body?.actorId ?? "demo", createdAt: new Date().toISOString() });
    io.emit("ride_updated", ride);
    res.json(ride);
  });

  app.get("/api/rides", (_req, res) => {
    res.json({ rides: Array.from(rides.values()) });
  });

  app.get("/api/rides/:rideId/events", (req, res) => {
    res.json({ events: rideEvents.filter((event) => event.rideId === req.params.rideId) });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`MotoJá server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
