import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { notificationController } from "@/src/controllers/notification.controller.js";



const router = Router();
// Define your routes here
router.get("/notifications/users/:id", protect, notificationController.getNotificationsByUserId);
router.delete("/notifications/:id", notificationController.deleteNotification);
router.post("/notifications", protect, notificationController.createNotification);
router.get("/notifications/:id", protect, notificationController.getNotificationById);
//router.get("/notifications/user/:id", protect, notificationController.getNotificationsByUserId);

export default router;

