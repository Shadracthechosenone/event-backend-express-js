import { Router } from "express";
import { authController } from "@/src/controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "@/src/middlewares/validation.js";



const router = Router();
// Define your routes here
router.post("/login", validate(loginSchema), authController.signIn);
router.post("/register", validate(registerSchema), authController.signUp);
router.post("/logout", authController.signOut);
router.post("/forgot-password-email", authController.forgotPassword);


export default router;








