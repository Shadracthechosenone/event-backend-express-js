import { Router } from "express";
import {authController} from "@/src/controllers/auth.controller.js";

const router = Router();
// Define your routes here
router.get("/login", authController.signUp);
router.post("/register", authController.signIn);
    

export default router;








