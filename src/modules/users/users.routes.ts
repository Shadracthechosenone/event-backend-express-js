import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { userController } from "@/src/controllers/user.controller.js";



const router = Router();
// Define your routes here
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id",userController.updateUser);
router.delete("/users/:id",userController.deleteUser)

export default router;

