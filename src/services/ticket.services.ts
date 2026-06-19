import { TicketRepository } from '@/src/repositories/ticket.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma, TicketStatus } from "@prisma/client";


interface Ticket {

    eventId: string
    userId: string
    price: number
    quantity: number
    status: TicketStatus
    qrCode: string | null
    paymentId: string | null
    createdAt: Date
    updatedAt: Date
}

const getTicketsByUser = async (userId: string): Promise<Ticket[] | []> => {
    // Logic to fetch all tickets from the 
    const tickets = await TicketRepository.findTicketsByUserId(userId);

    if (!tickets || tickets.length === 0) {
        throw new AppError(404, "No tickets found");
    }

    return tickets;
}



const createTicket = async (data: {
    eventId: string,
    userId: string,
    price: number
    quantity: number
    status: TicketStatus
    qrCode?: string
    paymentId?: string
    createdAt: Date
    updatedAt: Date
}) => {
    const ticket = await TicketRepository.createTicket(data);
    return ticket;
}





const deleteTicket = async (id: string) => {

    const ticket = await TicketRepository.findTicketById(id);

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }
    return await TicketRepository.deleteTicket(id);
}


const getTicketById = async (id: string) => {
    const ticket = await TicketRepository.findTicketById(id);
    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }
    return ticket;
}



export const TicketService = {
    getTicketsByUser,
    createTicket,
    deleteTicket,
    getTicketById
}
