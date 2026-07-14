// src/routes/v1/index.ts
import express from "express";
import authRoutes from "@/src/modules/auth/auth.route.js"; // Assuming you have auth routes in a separate file
import eventsRoutes from "@/src/modules/events/events.route.js"; // Assuming you have events routes in a separate file
import ticketRoutes from "@/src/modules/ticket/ticket.routes.js"; // Assuming you have ticket routes in a separate file
import eventParticipantRoutes from "@/src/modules/eventParticipant/eventParticipant.route.js"; // Assuming you have event participant routes in a separate file
import eventImageRoutes from "@/src/modules/eventImages/eventImages.route.js"; // Assuming you have event image routes in a separate file
import reviewRoutes from "@/src/modules/review/review.route.js"; // Assuming you have review routes in a separate file
import eventCategoryRoutes from "@/src/modules/eventCategory/eventcategory.routes.js"; // Assuming you have event category routes in a separate file
import notificationRoutes from "@/src/modules/notification/notification.route.js"; // Assuming you have notification routes in a separate file
import paymentRoutes from "@/src/modules/payment/payment.route.js"; // Assuming you have payment routes in a separate file
import adminRoutes from "@/src/modules/admin/admin.events.route.js"; // Assuming you have admin routes in a separate file
import userRoutes from "@/src/modules/users/users.routes.js"; // Assuming you have user routes in a separate file

export const configureV1Routes = () => {
  const router = express.Router();
  router.use("/auth", authRoutes); // Use the imported auth routes, not calling itself
  router.use("/", eventsRoutes); // Dynamically import events routes
  router.use("/", ticketRoutes); // Dynamically import ticket routes
  router.use("/", eventParticipantRoutes); // Dynamically import event participant routes
  router.use("/", eventImageRoutes);
  router.use("/", reviewRoutes);
  router.use("/", eventCategoryRoutes);
  router.use("/", notificationRoutes);
  router.use("/", paymentRoutes);
  router.use("/admin",adminRoutes); // Dynamically import admin routes
  router.use("/",userRoutes); // Dynamically import user routes
  // Add other v1 routes here
  // router.use("/users", userRoutes);
  // router.use("/events", eventRoutes);
  
  return router;
};

