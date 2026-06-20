import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventImageController } from "@/src/controllers/eventImage.controller.js";



const router = Router();
// Define your routes here
router.delete("/event-images/:id", eventImageController.deleteEventImage);
router.post("/event-images", protect, eventImageController.createEventImage);
router.get("/event-images/:id", protect, eventImageController.getEventImageById);
//router.get("/event-images/user/:id", protect, eventImageController.getEventImagesByUserId);

export default router;

