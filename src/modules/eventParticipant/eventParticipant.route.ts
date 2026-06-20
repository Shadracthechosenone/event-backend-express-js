import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventParticipantController } from "@/src/controllers/eventparticipant.controller.js";



const router = Router();
// Define your routes here
router.get("/event-participants/events/:id", protect, eventParticipantController.getEventParticipantsByEventId);
router.delete("/event-participants/:id", eventParticipantController.deleteEventParticipant);
router.post("/event-participants", protect, eventParticipantController.createEventParticipant);
router.get("/event-participants/:id", protect, eventParticipantController.getEventParticipantById);
//router.get("/event-participants/user/:id", protect, eventParticipantController.getEventParticipantsByUserId);

export default router;

