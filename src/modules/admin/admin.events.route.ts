import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventcontroller } from "@/src/controllers/events.controller.js";



const router = Router();
// Define your routes here
router.get("/events", eventcontroller.getAllEvents);
router.delete("/events/:id", eventcontroller.deleteEvent);
router.post("/events", eventcontroller.createEvent);
router.get("/events/:id", eventcontroller.getEventById);
router.put("/events/:id",eventcontroller.updateEventAsAdmin);
router.get("/events/user/:id", eventcontroller.getEventsByUserId);

export default router;


