import { db } from '@/src/utils/db.js';


const findAllReviews = () => {

    const Reviews = db.review.findMany({
        select: {
            id: true,
            eventId: true,
            ticketId: true,
            text:true
        }

    })
    return Reviews;

}

const findReviewById = async (id: string) => {
    console.log("Fetching review with ID:", id);

    return db.review.findUnique({
        where: {
            id
        }
    })

}

const findReviewsByEventId = async (eventId: string) => {
    return db.review.findMany({
        where: {
            eventId
        }
    })

}

const findReviewsByUserId = async (userId: string) => {
    return db.review.findMany({
        where: {
            userId
        }
    })
}






export const createReview = (data: {
    eventId: string;
    userId: string;
    rating:number;
    comment: string;
    createdAt: Date;
}) => {
    return db.review.create({
        data
    });
};



export const createManyReviews = async (data: {
    eventId: string;
    userId: string;
    rating:number;
    comment: string;
    createdAt: Date;
}[]) => {
    return db.review.createMany({
        data
    })
}


export const deleteReview = async (id: string) => {
    return db.review.delete({
        where: {
            id
        }
    })
}



export const ReviewRepository = {
    findAllReviews,
    findReviewById,
    findReviewsByEventId,
    findReviewsByUserId,
    createReview,
    createManyReviews,
    deleteReview
}