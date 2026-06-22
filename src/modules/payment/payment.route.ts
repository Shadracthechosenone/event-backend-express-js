import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { paymentController } from "@/src/controllers/payment.controller.js";



const router = Router();
// Define your routes here
router.get("/payments/users/:id", protect, paymentController.getPaymentsByUserId);
router.delete("/payments/:id", paymentController.deletePayment);
router.post("/payments", protect, paymentController.createPayment);
router.get("/payments/:id", protect, paymentController.getPaymentById);
//router.get("/payments/user/:id", protect, paymentController.getPaymentsByUserId);

export default router;

