import { EventParticipantRepository } from '@/src/repositories/eventparticipant.repository.js';
import AppError from "../utils/AppError.js";
import { ParticipantStatus, PaymentMethod, PaymentStatus, Prisma, TicketStatus } from "@prisma/client";
import { EventService } from '@/src/services/events.services.js';
import { PaymentService } from '@/src/services/payment.services.js';
import { PaymentRepository } from '@/src/repositories/payment.repository.js';
import { TicketRepository } from '@/src/repositories/ticket.repository.js';
import { db } from '@/src/utils/db.js';


/* EventRegistrationService
* Logique métier de l'inscription à un événement (gratuit ou payant)
* et de la confirmation de paiement via webhook.
* id: string;
    status: $Enums.TicketStatus;
    userId: string;
    eventId: string;
    price: number;
*/

type Ticket = {
    id: string,
    eventId: string,
    userId: string,
    price: number,
    status: TicketStatus,

}

type Payment = {
    id: string;
    status: PaymentStatus;
    ticketId: string;
    transactionRef: string | null;
}


type RegisterToEventInput = {
    userId: string;
    eventId: string;
    paymentMethod?: PaymentMethod; // requis si event payant
};

type RegisterToEventResult =
    | { type: "FREE_REGISTRATION"; ticket: Ticket }
    | { type: "PENDING_PAYMENT"; ticket: Ticket; payment: Payment };






interface EventParticipant {

    userId: string
    eventId: string
    ticketId: string | null
    status: ParticipantStatus
    checkedIn: boolean
    checkedInAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const getEventParticipantByUserId = async (userId: string): Promise<EventParticipant[] | []> => {
    // Logic to fetch all event participants from the
    const eventParticipants = await EventParticipantRepository.findEventParticipantsByUserId(userId);

    if (!eventParticipants || eventParticipants.length === 0) {
        throw new AppError(404, "No event participants found");
    }

    return eventParticipants;
}



const createEventParticipant = async (data: {
    userId: string
    eventId: string
    ticketId: string
    status: ParticipantStatus
    checkedIn: boolean
    checkedInAt?: Date
    createdAt: Date
    updatedAt: Date
}) => {
    const eventParticipant = await EventParticipantRepository.createEventParticipant(data);
    return eventParticipant;
};



const deleteEventParticipant = async (id: string) => {
    const eventParticipant = await EventParticipantRepository.findEventParticipantById(id);

    if (!eventParticipant) {
        throw new AppError(404, "Event participant not found");
    }
    return await EventParticipantRepository.deleteEventParticipant(id);
}


const getEventParticipantById = async (id: string) => {
    const eventParticipant = await EventParticipantRepository.findEventParticipantById(id);
    if (!eventParticipant) {
        throw new AppError(404, "Event participant not found");
    }
    return eventParticipant;
}

const getEventParticipantByEventId = async (eventId: string): Promise<EventParticipant[] | []> => {
    const eventParticipants = await EventParticipantRepository.findEventParticipantsByEventId(eventId);
    if (!eventParticipants || eventParticipants.length === 0) {
        throw new AppError(404, "No event participants found for this event");
    }
    return eventParticipants;
}

const registerEventParticipant = async (data:
    RegisterToEventInput
): Promise<RegisterToEventResult> => {
    const { userId, eventId, paymentMethod } = data;

    const event = await EventService.getEventbyId(eventId);
    if (!event) {
        throw new AppError(404, "Event not found");
    }
    if (event.status !== "ACTIVE") {
        throw new AppError(400, "Event is not open for registration");
    }

    // 1. Places disponibles
    const seatsAvailable = await EventService.getAvailablePlacesByEventId(eventId);
    if (seatsAvailable <= 0) {
        throw new AppError(400, "No available seats for this event");
    }

    // 2. Déjà inscrit ?
    const existingParticipation = await EventParticipantRepository.findByEventAndUser(
        eventId,
        userId
    );
    if (existingParticipation) {
        throw new AppError(409, "User already registered for this event");
    }


    // 3. Paiement déjà en cours ?
    const pendingPayment = await PaymentRepository.findPendingPaymentByUserAndEvent(
        userId,
        eventId
    );
    if (pendingPayment) {
        throw new AppError(
            409,
            "A payment is already in progress for this event"
        );
    }

    // 4. Paiement déjà réussi ? (garde-fou, ne devrait pas arriver si EventParticipant est propre)
    const successfulPayment = await PaymentRepository.findSuccessfulPaymentByUserAndEvent(
        userId,
        eventId
    );
    if (successfulPayment) {
        throw new AppError(409, "User already has a valid payment for this event");
    }

    // ---- Cas event GRATUIT ----
    if (event.isFree) {
        return db.$transaction(async (tx) => {
            const ticket = await TicketRepository.createTicketfn(
                {
                    eventId,
                    userId,
                    price: 0,
                    status: "CONFIRMED",
                },
                tx
            );

            await EventParticipantRepository.createEventParticipantfn(
                {
                    eventId,
                    userId,
                    ticketId: ticket.id,
                    status: "REGISTERED",
                },
                tx
            );

            return { type: "FREE_REGISTRATION", ticket };
        });
    }

    // ---- Cas event PAYANT ----
    if (!paymentMethod) {
        throw new AppError(400, "paymentMethod is required for a paid event");
    }

    return db.$transaction(async (tx) => {
        const ticket = await TicketRepository.createTicketfn(
            {
                eventId,
                userId,
                price: event.ticketPrice,
                status: "PENDING",
            },
            tx
        );

        const payment = await PaymentRepository.createPaymentfn(
            {
                ticketId: ticket.id,
                userId,
                eventId,
                amount: event.ticketPrice,
                method: paymentMethod,
                status: "PENDING",
            },
            tx
        );

        return { type: "PENDING_PAYMENT", ticket, payment };
    });






}



export const EventParticipantService = {
    getEventParticipantByUserId,
    createEventParticipant,
    deleteEventParticipant,
    getEventParticipantById,
    getEventParticipantByEventId
}





