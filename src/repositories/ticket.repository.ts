import { db } from '@/src/utils/db.js';
import { TicketStatus,Prisma } from "@prisma/client";


const findAllTickets = () => {

    const Tickets = db.ticket.findMany({
        select: {
            id: true,
            eventId: true,
            ticketId: true,
        }

    })
    return Tickets;

}


const findTicketsByEventId = async (eventId: string) => {
    return db.ticket.findMany({
        where: {
            eventId
        }
    })

}

const findTicketsByUserId = async (userId: string) => {
    return db.ticket.findMany({
        where: {
            userId
        }
    })
}

const findTicketsByStatus = async (status: TicketStatus) => {
    return db.ticket.findMany({
        where: {
            status
        }
    })
}




export const createTicket = (data:
    {
        eventId: string,
        userId: string,
        price: number,
        quantity: number,
        status: TicketStatus,
        qrCode?: string,
        paymentId?: string,
        createdAt: Date,
        updatedAt: Date,

    }
) => {
    return db.ticket.create({
        data
    }
    )
}


export const createManyTickets = async (data: {
    eventId: string;
    userId: string;
    price: number;
    quantity: number;
    status: TicketStatus;
    qrCode?: string;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}[]) => {
    return db.ticket.createMany({
        data
    })
}


export const deleteTicket = async (id: string) => {
    return db.ticket.delete({
        where: {
            id
        }
    })
}


// added infos 

const findTicketById = (id: string) => {
    const ticket = db.ticket.findUnique({
        where: { id },
        select: {
            id: true,
            eventId: true,
            userId: true,
            price: true,
            quantity: true,
            status: true,
            qrCode: true,
        }
    });
    return ticket;
}

const findTicketWithPayment = (id: string) => {
    const ticket = db.ticket.findUnique({
        where: { id },
        select: {
            id: true,
            eventId: true,
            userId: true,
            price: true,
            status: true,
            payment: true,
        }
    });
    return ticket;
}

// Cherche un ticket existant pour un user/event avec un statut donné
// (utile pour retrouver un ticket PENDING avant d'en recréer un)
const findTicketByUserAndEventAndStatus = (
    userId: string,
    eventId: string,
    status: TicketStatus
) => {
    const ticket = db.ticket.findFirst({
        where: { userId, eventId, status },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            eventId: true,
            userId: true,
            price: true,
            status: true,
        }
    });
    return ticket;
}

const findAllTicketsByUserAndEvent = (userId: string, eventId: string) => {
    const tickets = db.ticket.findMany({
        where: { userId, eventId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            eventId: true,
            userId: true,
            status: true,
            createdAt: true,
        }
    });
    return tickets;
}

// Crée un ticket (utilisable dans une transaction via tx)
const createTicketfn = (
    data: {
        eventId: string;
        userId: string;
        price: number;
        quantity?: number;
        status?: TicketStatus;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const ticket = client.ticket.create({
        data: {
            eventId: data.eventId,
            userId: data.userId,
            price: data.price,
            quantity: data.quantity ?? 1,
            status: data.status ?? "PENDING",
        },
        select: {
            id: true,
            eventId: true,
            userId: true,
            price: true,
            status: true,
        }
    });
    return ticket;
}

// Met à jour le statut d'un ticket (utilisable dans une transaction via tx)
const updateTicketStatus = (
    id: string,
    status: TicketStatus,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const ticket = client.ticket.update({
        where: { id },
        data: { status },
        select: {
            id: true,
            status: true,
        }
    });
    return ticket;
}

// Assigne un QR code à un ticket (après confirmation)
const setTicketQrCode = (
    id: string,
    qrCode: string,
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const ticket = client.ticket.update({
        where: { id },
        data: { qrCode },
        select: {
            id: true,
            qrCode: true,
        }
    });
    return ticket;
}





export const TicketRepository = {
    findAllTickets,
    findTicketById,
    createTicket,
    createManyTickets,
    deleteTicket,
    findTicketsByStatus,
    findTicketsByUserId,
    findTicketsByEventId,
    findTicketWithPayment,
    findTicketByUserAndEventAndStatus,
    findAllTicketsByUserAndEvent,
    createTicketfn,
    updateTicketStatus,
    setTicketQrCode
}
