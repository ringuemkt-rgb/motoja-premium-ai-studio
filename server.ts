import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Mock drivers state
  let drivers = [
    { id: "moto-001", lat: -23.5505, lng: -46.6333, type: "available", name: "Ricardo Silva" },
    { id: "moto-002", lat: -23.5520, lng: -46.6350, type: "delivery", name: "Marcos Oliveira" },
    { id: "moto-003", lat: -23.5480, lng: -46.6310, type: "available", name: "Ana Paula" },
    { id: "moto-004", lat: -23.5510, lng: -46.6360, type: "delivery", name: "Lucas Santos" },
  ];

  // Simulation: Move drivers slightly every 2 seconds
  setInterval(() => {
    drivers = drivers.map(d => ({
      ...d,
      lat: d.lat + (Math.random() - 0.5) * 0.0005,
      lng: d.lng + (Math.random() - 0.5) * 0.0005,
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

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
