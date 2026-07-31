import { EventImageService } from "../services/eventImage.services.js";
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const getEventImages = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    const eventImages = await EventImageService.getEventImages(eventId as string);

    sendResponse(res, 200, {
        message: "Event images retrieved successfully",
        data: { eventImages },
    });
});

const getEventImageById = asyncHandler(async (req, res) => {
    const eventImageId = Number(req.params.id);
    if (Number.isNaN(eventImageId)) {
        throw new AppError(400, "Invalid event image ID");
    }

    const eventImage = await EventImageService.getEventImageById(eventImageId);

    sendResponse(res, 200, {
        message: "Event image retrieved successfully",
        data: { eventImage },
    });
});

const uploadEventImages = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        throw new AppError(400, 'No files received (expected field "files")');
    }

    const eventImages = await EventImageService.uploadEventImages(eventId as string, files);

    sendResponse(res, 201, {
        message: "Event images uploaded successfully",
        data: { eventImages },
    });
});

const setPrimaryImage = asyncHandler(async (req, res) => {
    const eventImageId = Number(req.params.id);
    if (Number.isNaN(eventImageId)) {
        throw new AppError(400, "Invalid event image ID");
    }

    const eventImage = await EventImageService.setPrimaryImage(eventImageId);

    sendResponse(res, 200, {
        message: "Event image set as primary successfully",
        data: { eventImage },
    });
});

const deleteEventImage = asyncHandler(async (req, res) => {
    const eventImageId = Number(req.params.id);
    if (Number.isNaN(eventImageId)) {
        throw new AppError(400, "Invalid event image ID");
    }

    await EventImageService.deleteEventImage(eventImageId);

    sendResponse(res, 200, {
        message: "Event image deleted successfully",
    });
});

export const eventImageController = {
    getEventImages,
    getEventImageById,
    uploadEventImages,
    setPrimaryImage,
    deleteEventImage,
};