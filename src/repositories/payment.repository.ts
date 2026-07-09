import { db } from '@/src/utils/db.js';
import { PaymentStatus, PaymentMethod,Prisma } from "@prisma/client";


const findPaymentsByUserId = (userId:string) => {

    const Payments = db.payment.findMany({
        select: {
            id: true,
            eventId: true,
            ticketId: true,
            userId: true,
            amount: true,
            status: true,
            method: true
        },
        where:{
            userId
        }

    })
    return Payments;

}


const findPaymentsByEventId = async (eventId: string) => {
    return db.payment.findMany({
        where: {
            eventId
        }
    })

}



const findPaymentsByStatus = async (status: PaymentStatus) => {
    return db.payment.findMany({
        where: {
            status
        }
    })
}




export const createPayment = (data:
    {
        eventId: string,
        userId: string,
        ticketId: string,
        amount: number,
        status: PaymentStatus,
        currency: string,
        transactionRef: string,
        failureReason?: string,
        paidAt?: Date;
        method: PaymentMethod
    }
) => {
    return db.payment.create({
        data
    })
}




export const createManyPayments = async (data: {
    eventId: string,
    userId: string,
    ticketId: string,
    amount: number,
    status: PaymentStatus,
    currency: string,
    transactionRef: string,
    failureReason?: string,
    paidAt?: Date;
    method: PaymentMethod
}[]) => {
    return db.payment.createMany({
        data
    })
}


export const deletePayment = async (id: string) => {
    return db.payment.delete({
        where: {
            id
        }
    })
}



// added infos

const findPaymentById = (id: string) => {
    const payment = db.payment.findUnique({
        where: { id },
        select: {
            id: true,
            ticketId: true,
            userId: true,
            eventId: true,
            amount: true,
            status: true,
            method: true,
            transactionRef: true,
        }
    });
    return payment;
}

// Un ticket = un paiement (relation 1:1 via ticketId unique)
const findPaymentByTicketId = (ticketId: string) => {
    const payment = db.payment.findUnique({
        where: { ticketId },
        select: {
            id: true,
            ticketId: true,
            status: true,
            transactionRef: true,
        }
    });
    return payment;
}

// Retrouve un paiement via la référence transaction retournée par le provider
// (CinetPay / GeniusPay / Wave...) — utilisé dans le webhook
const findPaymentByTransactionRef = (transactionRef: string) => {
    const payment = db.payment.findUnique({
        where: { transactionRef },
        select: {
            id: true,
            ticketId: true,
            userId: true,
            eventId: true,
            status: true,
            transactionRef: true,
        }
    });
    return payment;
}

// Un user peut avoir PLUSIEURS paiements pour un même event
// (retries après FAILED, tickets multiples, etc.)
const findAllPaymentsByUserAndEvent = (userId: string, eventId: string) => {
    const payments = db.payment.findMany({
        where: { userId, eventId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            ticketId: true,
            status: true,
            method: true,
            amount: true,
            createdAt: true,
        }
    });
    return payments;
}

// Cherche le paiement PENDING le plus récent d'un user pour un event
const findPendingPaymentByUserAndEvent = (userId: string, eventId: string) => {
    const payment = db.payment.findFirst({
        where: { userId, eventId, status: "PENDING" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            ticketId: true,
            status: true,
        }
    });
    return payment;
}

// Cherche un paiement SUCCESS d'un user pour un event
const findSuccessfulPaymentByUserAndEvent = (userId: string, eventId: string) => {
    const payment = db.payment.findFirst({
        where: { userId, eventId, status: "SUCCESS" },
        select: {
            id: true,
            ticketId: true,
            status: true,
        }
    });
    return payment;
}

// Crée un paiement (utilisable dans une transaction via tx)
const createPaymentfn = (
    data: {
        ticketId: string;
        userId: string;
        eventId: string;
        amount: number;
        currency?: string;
        method: PaymentMethod;
        transactionRef?: string;
        status?: PaymentStatus;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const payment = client.payment.create({
        data: {
            ticketId: data.ticketId,
            userId: data.userId,
            eventId: data.eventId,
            amount: data.amount,
            currency: data.currency ?? "XOF",
            method: data.method,
            transactionRef: data.transactionRef,
            status: data.status ?? "PENDING",
        },
        select: {
            id: true,
            ticketId: true,
            status: true,
            transactionRef: true,
        }
    });
    return payment;
}

// Met à jour le statut d'un paiement (ex: confirmation webhook)
export const updatePaymentStatus = (
    id: string,
    data: {
        status: PaymentStatus;
        transactionRef?: string;
        failureReason?: string;
        paidAt?: Date;
    },
    tx?: Prisma.TransactionClient
) => {
    const client = tx ?? db;
    const payment = client.payment.update({
        where: { id },
        data,
        select: {
            id: true,
            ticketId: true,
            status: true,
            paidAt: true,
            transactionRef: true,
            include:{
                event:true //besoin de eventId 
            }
            
        }
    });
    return payment;
}



export const PaymentRepository = {
    findPaymentsByUserId,
    findPaymentById,
    findPaymentsByEventId,
    findPaymentsByStatus,
    createPayment,
    deletePayment,
    findPaymentByTicketId,
    findPaymentByTransactionRef,
    findAllPaymentsByUserAndEvent,
    findPendingPaymentByUserAndEvent,
    findSuccessfulPaymentByUserAndEvent,
    createPaymentfn,
    updatePaymentStatus
}


