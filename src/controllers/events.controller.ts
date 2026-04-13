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

    const events = await EventService.getEvents(req.query
      )
      

    console.log(take, skip, orderBy)
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



