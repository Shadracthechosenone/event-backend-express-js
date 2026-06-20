import { Router } from "express";
import protect from "@/src/middlewares/protect.js";
import { reviewController } from "@/src/controllers/review.controller.js";



const router = Router();
// Define your routes here
router.get("/reviews/users/:id", protect, reviewController.getReviewsByUserId);
router.delete("/reviews/:id", reviewController.deleteReview);
router.post("/reviews", protect, reviewController.createReview);
router.get("/reviews/:id", protect, reviewController.getReviewById);
//router.get("/reviews/user/:id", protect, reviewController.getReviewsByUserId);

export default router;

