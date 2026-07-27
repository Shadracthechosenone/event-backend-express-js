import { Router } from "express";
import { authController } from "@/src/controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "@/src/middlewares/validation.js";
import { loginLimiter } from "@/src/middlewares/rateLimiter.js";


const router = Router();
// Define your routes here
//router.post("/login", validate(loginSchema), authController.signIn);
router.post("/login",loginLimiter,  authController.signIn);
router.post("/register", validate(registerSchema), authController.signUp);
router.post("/logout", authController.signOut);
router.post("/forgot-password-email", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh-token", authController.refreshToken);

export default router;












