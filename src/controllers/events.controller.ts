import { EventService } from "../services/events.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { registerEventParticipant } from "../services/eventParticipant.services.js";
import { initiateGeniusPayPayment } from "../services/geniuspay.services.js";
import catchAsync from "../utils/catchAsync.js"



const getEventsByUserConnectedId = asyncHandler(async (req, res) => {
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


const getEventsByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (typeof userId !== "string") {
        throw new AppError(400, "Invalid user ID");
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

const deleteEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;

    if (typeof eventId !== "string") {
        throw new AppError(400, "Invalid event ID");
    }

    await EventService.deleteEvent(eventId);
    sendResponse(res, 200, {
        message: "Event deleted successfully",
    });
})


const createEvent = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            name,
            description,
            userId,
            startAt,
            endAt,
            address,
            latitude,
            longitude,
            eventCategoriesId,
            maxCapacity,
            ticketPrice
        } = req.body;
  console.log(req.body)


        const event = await EventService.createEvent({
            name,
            description,
            userId,
            startAt,
            endAt,
            address,
            latitude,
            longitude,
            eventCategoriesId,
            maxCapacity,
            ticketPrice
        })
        sendResponse(res, 201, {
            message: "Event created successfully",
            data: {
                event
            }
        })
    } catch (error) {
        next(error);
    }

})



const getEventById = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    if (typeof eventId !== "string") {
        throw new AppError(400, "Invalid event ID");
    }

    const event = await EventService.getEventbyId(eventId);

    sendResponse(res, 200, {
        message: "Event retrieved successfully",
        data: {
            event
        }
    });
})


const updateEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError(401, "Unauthorized, please log in");
    }

    const {
        name,
        description,
        startAt,
        endAt,
        address,
        latitude,
        longitude,
        eventCategoriesId,
        maxCapacity,
        ticketPrice
    } = req.body;

    const updatedEvent = await EventService.updateEvent(eventId, userId, {
        name,
        description,
        startAt,
        endAt,
        address,
        latitude,
        longitude,
        eventCategoriesId,
        maxCapacity,
        ticketPrice
    });

    sendResponse(res, 200, {
        message: "Event updated successfully",
        data: {
            event: updatedEvent
        }
    });
})


const registerToEventHandler = catchAsync(async (req, res) => {
    const userId = req.user?.id as string;
    const { paymentMethod } = req.body;

    const eventId = req.params.id as string
    const result = await registerEventParticipant({ userId, eventId, paymentMethod });

    if (result.type === "FREE_REGISTRATION") {
        return res.status(201).json({ status: "success", data: result.ticket });
    }

    const { checkoutUrl } = await initiateGeniusPayPayment({
        paymentId: result.payment.id,
        amount: result.ticket.price,
        description: `Inscription événement`,
        customerName: req.user?.name,
        customerEmail: req.user?.email,
        customerPhone: req.user?.phone,
    });

    res.status(201).json({
        status: "success",
        data: { ticket: result.ticket, checkoutUrl },
    });
});

export { registerToEventHandler };


const getEventsInViewportHandler = asyncHandler(async (req, res, next) => {
    try {
        const { swLat, swLng, neLat, neLng } = req.query;
        const events = await EventService.getEventsInViewport({
            swLat: parseFloat(swLat as string),
            swLng: parseFloat(swLng as string),
            neLat: parseFloat(neLat as string),
            neLng: parseFloat(neLng as string),
        });
        res.status(200).json({ status: "success", data: events });
    } catch (error) {
        next(error);
    }
});

const getEventsNearbyHandler = asyncHandler(async (req, res, next) => {
    try {
        const { lat, lng, radiusKm } = req.query;
        const events = await EventService.getEventsNearby({
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string),
            radiusKm: radiusKm ? parseFloat(radiusKm as string) : undefined,
        });
        res.status(200).json({ status: "success", data: events });
    } catch (error) {
        next(error);
    }
});


export const eventcontroller = {
    getEventsByUserConnectedId,
    getAllEvents,
    deleteEvent,
    createEvent,
    getEventById,
    updateEvent,
    getEventsByUserId,
    registerToEventHandler,
    getEventsInViewportHandler,
    getEventsNearbyHandler
}



