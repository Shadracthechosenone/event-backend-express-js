import { TicketService } from "../services/ticket.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';




const getTicketsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError(401, "Unauthorized, please log in");
    }
    const tickets = await TicketService.getTicketsByUser(userId);

    sendResponse(res, 200, {
        message: "Tickets retrieved successfully",
        data: {
            tickets
        },

    })
})

const deleteTicket = asyncHandler(async (req, res) => {
    const ticketId = req.params.id;

    if (typeof ticketId !== "string") {
        throw new AppError(400, "Invalid ticket ID");
    }

    await TicketService.deleteTicket(ticketId);
    sendResponse(res, 200, {
        message: "Ticket deleted successfully",
    });
})


const createTicket = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            eventId,
            userId,
            price,
            quantity,
            status,
            qrCode,
            paymentId,
            createdAt,
            updatedAt
        } = req.body;

        const ticket = await TicketService.createTicket({
            eventId,
            userId,
            price,
            quantity,
            status,
            qrCode,
            paymentId,
            createdAt,
            updatedAt
        })
        sendResponse(res, 201, {
            message: "Ticket created successfully",
            data: {
                ticket
            }
        })
    } catch (error) {
        next(error);
    }

})


const getTicketById = asyncHandler(async (req, res) => {
    const ticketId = req.params.id;
    if (typeof ticketId !== "string") {
        throw new AppError(400, "Invalid ticket ID");
    }

    const ticket = await TicketService.getTicketById(ticketId);

    sendResponse(res, 200, {
        message: "Ticket retrieved successfully",
        data: {
            ticket
        }
    });
})

export const ticketController = {
    getTicketsByUserId,
    getTicketById,
    createTicket,
    deleteTicket


}