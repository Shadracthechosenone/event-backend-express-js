import { db } from '@/src/utils/db.js';
import { PaymentStatus, PaymentMethod } from "@prisma/client";


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

const findPaymentById = async (id: string) => {
    console.log("Fetching payment with ID:", id);

    return db.payment.findUnique({
        where: {
            id
        }
    })

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



export const PaymentRepository = {
    findPaymentsByUserId,
    findPaymentById,
    findPaymentsByEventId,
    findPaymentsByStatus,
    createPayment,
    deletePayment
}


