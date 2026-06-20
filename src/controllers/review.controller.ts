import { ReviewService } from "../services/review.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';




const getReviewsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError(401, "Unauthorized, please log in");
    }
    const reviews = await ReviewService.getReviewsByUser(userId);

    sendResponse(res, 200, {
        message: "Reviews retrieved successfully",
        data: {
            reviews
        },

    })
})

const deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;

    if (typeof reviewId !== "string") {
        throw new AppError(400, "Invalid review ID");
    }

    await ReviewService.deleteReview(reviewId);
    sendResponse(res, 200, {
        message: "Review deleted successfully",
    });
})


const createReview = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            eventId,
            userId,
            rating,
            comment,
            createdAt
        } = req.body;

        const review = await ReviewService.createReview({
            eventId,
            userId,
            rating,
            comment,
            createdAt
        })
        sendResponse(res, 201, {
            message: "Review created successfully",
            data: {
                review
            }
        })
    } catch (error) {
        next(error);
    }

})


const getReviewById = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;
    if (typeof reviewId !== "string") {
        throw new AppError(400, "Invalid review ID");
    }

    const review = await ReviewService.getReviewById(reviewId);

    sendResponse(res, 200, {
        message: "Review retrieved successfully",
        data: {
            review
        }
    });
})

export const reviewController = {
    getReviewsByUserId,
    getReviewById,
    createReview,
    deleteReview


}