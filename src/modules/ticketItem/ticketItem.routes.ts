import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { verifyTicketQrCode } from "@/src/controllers/ticketItem.controller.js";
import { restrictTo } from "@/src/middlewares/restrictTo.js";



const router = Router();

//enlever protect et restrict 

//protect, restrictTo("ADMIN", "SUPERADMIN"), 

router.post("/verify-qr",verifyTicketQrCode);

export default router;