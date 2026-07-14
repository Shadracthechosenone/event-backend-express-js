import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventCategoryController } from "@/src/controllers/eventcategory.controller.js";



const router = Router();
// Define your routes here
router.get("/event-categories/",eventCategoryController.getEventCategories); // enlever protect test admin
router.delete("/event-categories/:id", eventCategoryController.deleteEventCategory);
router.post("/event-categories", protect, eventCategoryController.createEventCategory);
router.get("/event-categories/:id", protect, eventCategoryController.getEventCategoryById);
//router.get("/event-categories/user/:id", protect, eventCategoryController.getEventCategoriesByUserId);

export default router;

