// server.ts
import 'dotenv/config'; // ← chargé ici avant tout
import express from "express";
import { configureRoutes } from "./routes/index.js";
import { globalErrorHandler } from "./utils/GlobalErrorHandler.js";
import webhookRoutes from "./modules/webhooks/webhooks.routes.js"; // Import the webhook routes
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(
  cors({
    origin: "http://localhost:5173", // l'URL de ton front (Vite par ex.)
    credentials: true, // si tu utilises cookies / sessions / auth
  })
);

app.use("/api",webhookRoutes)  // 1. Webhooks EN PREMIER, avant express.json() global
app.use(express.json());
app.use("/api", configureRoutes());

app.use(globalErrorHandler); // Middleware de gestion des erreurs globales
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});




















