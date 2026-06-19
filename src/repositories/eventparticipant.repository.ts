import { db } from '@/src/utils/db.js';
import { ParticipantStatus } from "@prisma/client";

const findAllEventParticipants = () => {

    const Participants = db.eventParticipant.findMany({
        select: {
            id: true,
            eventId: true,
            userId: true,
        }

    })
    return Participants;

}

const findEventParticipantById = async (id: string) => {

    return db.eventParticipant.findUnique({
        where: {
            id
        }
    })

}

const findEventParticipantsByEventId = async (eventId: string) => {
    return db.eventParticipant.findMany({
        where: {
            eventId
        }
    })

}

const findEventParticipantsByUserId = async (userId: string) => {
    return db.eventParticipant.findMany({
        where: {
            userId
        }
    })
}

const findEventParticipantsByStatus = async (status: ParticipantStatus) => {
    return db.eventParticipant.findMany({
        where: {
            status
        }
    })
}





export const createEventParticipant = (data: {
    eventId: string;
    userId: string;
    ticketId: string;
    status: ParticipantStatus;
    checkedIn: boolean;
    checkedInAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}) => {
    return db.eventParticipant.create({
        data
    })
}



export const createManyEventParticipants = async (data: {
    eventId: string;
    userId: string;
    price: number;
    quantity: number;
    status: ParticipantStatus;
    qrCode?: string;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}[]) => {
    return db.eventParticipant.createMany({
        data
    })
}


export const deleteEventParticipant = async (id: string) => {
    return db.eventParticipant.delete({
        where: {
            id
        }
    })
}



export const EventParticipantRepository = {
    findAllEventParticipants,
    findEventParticipantById,
    createEventParticipant,
    createManyEventParticipants,
    deleteEventParticipant,
    findEventParticipantsByStatus,
    findEventParticipantsByUserId
}