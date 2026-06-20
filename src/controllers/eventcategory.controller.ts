import { EventCategoryService } from "../services/eventCategory.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';





const deleteEventCategory = asyncHandler(async (req, res) => {
    const eventCategoryId = Number(req.params.id);

    if (typeof eventCategoryId !== "number") {
        throw new AppError(400, "Invalid event category ID");
    }

    await EventCategoryService.deleteEventCategory(eventCategoryId);
    sendResponse(res, 200, {
        message: "Event category deleted successfully",
    });
})


const createEventCategory = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            name
        } = req.body;

        const eventCategory = await EventCategoryService.createEventCategory({
            name
        });
        sendResponse(res, 201, {
            message: "Event category created successfully",
            data: {
                eventCategory
            }
        })
    } catch (error) {
        next(error);
    }
})


const getEventCategoryById = asyncHandler(async (req, res) => {

    const eventCategoryId = Number(req.params.id);
    if (typeof eventCategoryId !== "number") {
        throw new AppError(400, "Invalid event category ID");
    }

    const eventCategory = await EventCategoryService.getEventCategoryById(eventCategoryId);

    sendResponse(res, 200, {
        message: "Event category retrieved successfully",
        data: {
            eventCategory
        }
    });
})


const getEventCategories = asyncHandler(async (req, res) => {

    const eventCategories = await EventCategoryService.getEventCategories();
    sendResponse(res, 200, {
        message: "Event categories retrieved successfully",
        data: {
            eventCategories
        }

    })
});



export const eventCategoryController = {
    getEventCategories,
    getEventCategoryById,
    createEventCategory,
    deleteEventCategory
}
