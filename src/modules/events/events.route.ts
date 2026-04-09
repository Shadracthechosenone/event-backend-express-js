import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventcontroller } from "@/src/controllers/events.controller.js";



const router = Router();
// Define your routes here
router.get("/events", protect, eventcontroller.getEventsByUserId);
router.get("/allevents", protect, eventcontroller.getAllEvents);

export default router;


