import { EventParticipantRepository } from '@/src/repositories/eventparticipant.repository.js';
import AppError from "../utils/AppError.js";
import { ParticipantStatus } from "@prisma/client";


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

export const EventParticipantService = {
    getEventParticipantByUserId,
    createEventParticipant,
    deleteEventParticipant,
    getEventParticipantById,
    getEventParticipantByEventId
}





