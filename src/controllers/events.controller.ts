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
        res.status(200).json(events);


        sendResponse(res, 200, {    
        message: "Events retrieved successfully",
        data: {
           events
        },



    })
})

export const eventcontroller = {
    getEventsByUserId
} 



