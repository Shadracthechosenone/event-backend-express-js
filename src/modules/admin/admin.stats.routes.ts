import { Router } from "express";
import { adminController } from "@/src/controllers/admin.controller.js";



const router = Router();
// Define your routes here
router.get("/dashboard/stats", adminController.getAdminStats);


export default router;


