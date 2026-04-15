import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventcontroller } from "@/src/controllers/events.controller.js";



const router = Router();
// Define your routes here
router.get("/events", protect, eventcontroller.getEventsByUserId);
router.get("/allevents", protect, eventcontroller.getAllEvents);
router.delete("/events/:id", protect, eventcontroller.deleteEvent);
router.post("/events", protect, eventcontroller.createEvent);
router.get("/events/:id", protect, eventcontroller.getEventById);
//router.get("/events/user/:id", protect, eventcontroller.getEventsByUserId);
router.get("/events/user/me", protect, eventcontroller.getEventsByUserId);

export default router;


