import { ReviewRepository } from '@/src/repositories/review.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma } from "@prisma/client";


interface Review {

    eventId: string
    userId: string
    rating: number
    comment: string | null
    createdAt: Date
}

const getReviewsByUser = async (userId: string): Promise<Review[] | []> => {
    // Logic to fetch all reviews from the 
    const reviews = await ReviewRepository.findReviewsByUserId(userId);

    if (!reviews || reviews.length === 0) {
        throw new AppError(404, "No reviews found");
    }

    return reviews;
}



const createReview = async (data: {
    eventId: string,
    userId: string,
    rating: number
    comment: string
    createdAt: Date
}) => {
    const review = await ReviewRepository.createReview(data);
    return review;
}



const deleteReview = async (id: string) => {

    const review = await ReviewRepository.findReviewById(id);

    if (!review) {
        throw new AppError(404, "Review not found");
    }
    return await ReviewRepository.deleteReview(id);
}


const getReviewById = async (id: string) => {
    const review = await ReviewRepository.findReviewById(id);
    if (!review) {
        throw new AppError(404, "Review not found");
    }
    return review;
}




export const ReviewService = {
    getReviewsByUser,
    createReview,
    deleteReview,
    getReviewById
}



