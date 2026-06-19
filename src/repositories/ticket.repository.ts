import { db } from '@/src/utils/db.js';
import { TicketStatus } from "@prisma/client";


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

const findTicketById = async (id: string) => {
    console.log("Fetching ticket with ID:", id);

    return db.ticket.findUnique({
        where: {
            id
        }
    })

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



export const TicketRepository = {
    findAllTickets,
    findTicketById,
    createTicket,
    createManyTickets,
    deleteTicket,
    findTicketsByStatus,
    findTicketsByUserId
}