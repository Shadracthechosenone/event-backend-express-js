import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { eventImageController } from "@/src/controllers/eventImage.controller.js";
import upload from "@/src/middlewares/upload.js";

const router = Router();

router.post(
    "/:eventId/images",
    upload.array("files", 10),
    eventImageController.uploadEventImages
);

router.get("/:eventId/images", eventImageController.getEventImages);
router.get("/images/:id", eventImageController.getEventImageById);
router.patch("/images/:id/primary", eventImageController.setPrimaryImage);
router.delete("/images/:id", eventImageController.deleteEventImage);

export default router;