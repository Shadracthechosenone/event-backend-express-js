import { TicketRepository } from '@/src/repositories/ticket.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma } from "@prisma/client";
import ApiFeatures from '../utils/ApiFeatures.js';
import { TicketStatus } from "@prisma/client";

export const createTicket = async (data: {
    eventId: string;
    userId: string;
    price: number;
    quantity: number;
    status: TicketStatus;
    qrCode?: string;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}) => {
    const ticket = await TicketRepository.createTicket(data);
    return ticket;
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
    const tickets = await TicketRepository.createManyTickets(data);
    return tickets;
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

const findAllTickets = async () => {
    const tickets = await TicketRepository.findAllTickets();
    return tickets;
}


const findTicketsByStatus = async (status: TicketStatus) => {
    const tickets = await TicketRepository.findTicketsByStatus(status);
    return tickets;
}



const findTicketsByUserId = async (userId: string) => {
    const tickets = await TicketRepository.findTicketsByUserId(userId);
    return tickets;
}



export const ticketService = {
    createTicket,
    createManyTickets,
    deleteTicket,
    getTicketById,
    findAllTickets,
    findTicketsByStatus,
    findTicketsByUserId
};