import { EventService } from "../services/events.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/Apperror.js';
import asyncHandler from '../utils/asyncHandler.js';




const getEventsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError(401, "Unauthorized, please log in");
    }
    const events = await EventService.getEventsByUser(userId);

    sendResponse(res, 200, {
        message: "Events retrieved successfully",
        data: {
            events
        },



    })
})


// recuperer tous les events avec pagination et filtrage par category name


export const getAllEvents = asyncHandler(async (req, res) => {
    const {
        categoryName,
        status,
        skip,
        take,
        orderBy,
    } = req.query;

    const events = await EventService.getEvents({
        where: {
            ...(categoryName ? { categoryName: String(categoryName) } : {}),
            ...(status ? { status: String(status) } : {}),
        },
        skip: skip ? parseInt(String(skip)) : 0,
        take: take ? parseInt(String(take)) : 10,
        orderBy: orderBy
            ? { [String(orderBy)]: "desc" }
            : { createdAt: "desc" },
    });

    sendResponse(res, 200, {
        message: "Events retrieved successfully",
        data: {
            events,
        },
    });
});

export const eventcontroller = {
    getEventsByUserId,
    getAllEvents
}



