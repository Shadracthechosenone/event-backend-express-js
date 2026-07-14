import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { userController } from "@/src/controllers/user.controller.js";



const router = Router();
// Define your routes here
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);

export default router;

