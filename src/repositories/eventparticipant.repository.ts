import { db } from '@/src/utils/db.js';
import { ParticipantStatus, Prisma } from "@prisma/client";


interface EventParticipant {
    userId: string
    eventId: string
    status: ParticipantStatus
    checkedIn: boolean
    checkedInAt: Date | null
    createdAt: Date
    updatedAt: Date
}

interface UpsertEventParticipantInput {
    eventId: string;
    userId: string;
    status: ParticipantStatus;
}



interface UpsertEventParticipantInput {
    eventId: string;
    userId: string;
    status: ParticipantStatus;
}


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


const findByEventAndUser = async (
    eventId: string,
    userId: string
): Promise<EventParticipant | null> => {
    return db.eventParticipant.findFirst({
        where: { eventId, userId },
    });
};


// Grâce à @@unique([eventId, userId]) : un user = une seule participation par event
const findParticipantByEventAndUser = (eventId: string, userId: string) => {
    const participant = db.eventParticipant.findUnique({
        where: {
            eventId_userId: { eventId, userId },
        },
        select: {
            id: true,
            eventId: true,
            userId: true,
            status: true,
        }
    });
    return participant;
}

const findParticipantById = (id: string) => {
    const participant = db.eventParticipant.findUnique({
        where: { id },
        select: {
            id: true,
            eventId: true,
            userId: true,
            status: true,
            checkedIn: true,
        }
    });
    return participant;
}

// Crée une participation (utilisable dans une transaction via tx)
// - Event gratuit : ticketId = null, status = REGISTERED
// - Event payant  : ticketId renseigné après confirmation paiement, status = CONFIRMED
const createEventParticipantfn = (
    data: {
        eventId: string;
        userId: string;
        ticketId?: string;
        status?: ParticipantStatus;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const participant = client.eventParticipant.create({
        data: {
            eventId: data.eventId,
            userId: data.userId,
            ticketId: data.ticketId,
            status: data.status ?? "REGISTERED",
        },
        select: {
            id: true,
            eventId: true,
            userId: true,
            status: true,
        }
    });
    return participant;
}

// Met à jour le statut d'une participation (ex: après confirmation paiement)
const updateParticipantStatus = (
    id: string,
    status: ParticipantStatus,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const participant = client.eventParticipant.update({
        where: { id },
        data: { status },
        select: {
            id: true,
            status: true,
        }
    });
    return participant;
}

// Marque un participant comme présent (scan QR à l'entrée)
const markParticipantCheckedIn = (id: string, tx?: Prisma.TransactionClient) => {
    const client = tx ?? db;
    const participant = client.eventParticipant.update({
        where: { id },
        data: {
            checkedIn: true,
            checkedInAt: new Date(),
            status: "PRESENT",
        },
        select: {
            id: true,
            checkedIn: true,
            checkedInAt: true,
            status: true,
        }
    });
    return participant;
}

// Compte le nombre de participants actifs sur un event
// (REGISTERED + CONFIRMED + PRESENT, exclut CANCELLED)
const countActiveParticipantsByEvent = (eventId: string) => {
    const count = db.eventParticipant.count({
        where: {
            eventId,
            status: { in: ["REGISTERED", "CONFIRMED", "PRESENT"] },
        },
    });
    return count;
}


const upsertEventParticipantFn = async (
    data: UpsertEventParticipantInput,
    tx: Prisma.TransactionClient
) => {
    const { eventId, userId, status } = data;

    return tx.eventParticipant.upsert({
        where: {
            eventId_userId: {
                eventId,
                userId,
            },
        },
        create: {
            eventId,
            userId,
            status,
        },
        update: {
            status,
        },
        select: {
            id: true,
            eventId: true,
            userId: true,
            status: true,
            checkedIn: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export { upsertEventParticipantFn };


export const EventParticipantRepository = {
    findAllEventParticipants,
    findEventParticipantById,
    createEventParticipant,
    createManyEventParticipants,
    deleteEventParticipant,
    findEventParticipantsByStatus,
    findEventParticipantsByUserId,
    findEventParticipantsByEventId,
    findByEventAndUser,
    findParticipantByEventAndUser,
    findParticipantById,
    createEventParticipantfn,
    updateParticipantStatus,
    markParticipantCheckedIn,
    countActiveParticipantsByEvent,
    upsertEventParticipantFn

}