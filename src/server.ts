// server.ts
import express from "express";
import { configureRoutes } from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", configureRoutes());

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});