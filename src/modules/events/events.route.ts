import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventcontroller } from "@/src/controllers/events.controller.js";



const router = Router();
// Define your routes here
router.get("/events", protect, eventcontroller.getAllEvents);
router.delete("/events/:id", eventcontroller.deleteEvent);
router.post("/events", protect, eventcontroller.createEvent);
router.get("/events/:id", protect, eventcontroller.getEventById);
router.get("/events/user/me", protect, eventcontroller.getEventsByUserConnectedId);
router.put("/events/:id", protect, eventcontroller.updateEvent);
router.get("/events/user/:id", protect, eventcontroller.getEventsByUserId);
router.post("/events/:id/register", protect, eventcontroller.registerToEventHandler);

export default router;


