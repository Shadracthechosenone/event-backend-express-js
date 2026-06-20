import { EventParticipantService } from "../services/eventParticipant.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';





const deleteEventParticipant = asyncHandler(async (req, res) => {
    const eventParticipantId = req.params.id

    if (typeof eventParticipantId !== "string") {
        throw new AppError(400, "Invalid event participant ID");
    }

    await EventParticipantService.deleteEventParticipant(eventParticipantId);
    sendResponse(res, 200, {
        message: "Event participant deleted successfully",
    });
})


const createEventParticipant = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            userId,
            eventId,
            ticketId,
            status,
            checkedIn,
            checkedInAt,
            createdAt,
            updatedAt
        } = req.body;

        const eventParticipant = await EventParticipantService.createEventParticipant({
            userId,
            eventId,
            ticketId,
            status,
            checkedIn,
            checkedInAt,
            createdAt,
            updatedAt
        });
        sendResponse(res, 201, {
            message: "Event participant created successfully",
            data: {
                eventParticipant
            }
        })
    } catch (error) {
        next(error);
    }
})


const getEventParticipantById = asyncHandler(async (req, res) => {

    const eventParticipantId = req.params.id;
    if (typeof eventParticipantId !== "string") {
        throw new AppError(400, "Invalid event participant ID");
    }

    const eventParticipant = await EventParticipantService.getEventParticipantById(eventParticipantId);

    sendResponse(res, 200, {
        message: "Event participant retrieved successfully",
        data: {
            eventParticipant
        }
    });
})

const getEventParticipantsByEventId = asyncHandler(async (req, res) => {

    const eventId = req.params.eventId; 
    if (typeof eventId !== "string") {
        throw new AppError(400, "Invalid event ID");
    }   

    const eventParticipants = await EventParticipantService.getEventParticipantByEventId(eventId);

    sendResponse(res, 200, {    
        message: "Event participants retrieved successfully",
        data: {
            eventParticipants
        }
    });
})


export const eventParticipantController = {
    getEventParticipantById,
    createEventParticipant,
    deleteEventParticipant,
    getEventParticipantsByEventId
}
