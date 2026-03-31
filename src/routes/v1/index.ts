// src/routes/v1/index.ts
import express from "express";
import authRoutes from "@/src/modules/auth/auth.route.js"; // Assuming you have auth routes in a separate file

export const configureV1Routes = () => {
  const router = express.Router();
  router.use("/auth", authRoutes); // Use the imported auth routes, not calling itself
  // Add other v1 routes here
  // router.use("/users", userRoutes);
  // router.use("/events", eventRoutes);
  
  return router;
};