import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { ticketController } from "@/src/controllers/ticket.controller.js";



const router = Router();
// Define your routes here
router.get("/tickets", protect, ticketController.getTicketsByUserId);
router.delete("/tickets/:id", ticketController.deleteTicket);
router.post("/tickets", protect, ticketController.createTicket);
router.get("/tickets/:id", protect, ticketController.getTicketById);
//router.get("/tickets/user/:id", protect, ticketController.getTicketsByUserId);

export default router;

