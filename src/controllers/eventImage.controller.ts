import { EventImageService } from "../services/eventImage.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';





const deleteEventImage = asyncHandler(async (req, res) => {
    const eventImageId = Number(req.params.id);

    if (typeof eventImageId !== "number") {
        throw new AppError(400, "Invalid event image ID");
    }

    await EventImageService.deleteEventImage(eventImageId);
    sendResponse(res, 200, {
        message: "Event image deleted successfully",
    });
})


const createEventImage = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            eventId,
            url,
            isPrimary,
            createdAt
        } = req.body;

        const eventImage = await EventImageService.createEventImage({
            eventId,
            url,
            isPrimary,
            createdAt
        });
        sendResponse(res, 201, {
            message: "Event image created successfully",
            data: {
                eventImage
            }
        })
    } catch (error) {
        next(error);
    }
})


const getEventImageById = asyncHandler(async (req, res) => {

    const eventImageId = Number(req.params.id);
    if (typeof eventImageId !== "number") {
        throw new AppError(400, "Invalid event image ID");
    }

    const eventImage = await EventImageService.getEventImageById(eventImageId);

    sendResponse(res, 200, {
        message: "Event image retrieved successfully",
        data: {
            eventImage
        }
    });
})


const getEventImages = asyncHandler(async (req, res) => {

    const eventImages = await EventImageService.getEventImages();
    sendResponse(res, 200, {
        message: "Event images retrieved successfully",
        data: {
            eventImages
        }

    })
});



export const eventImageController = {
    getEventImages,
    getEventImageById,
    createEventImage,
    deleteEventImage
}
