import { PaymentRepository } from '@/src/repositories/payment.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma, PaymentStatus, PaymentMethod } from "@prisma/client";


interface Payment {
    eventId: string,
    ticketId: string,
    userId: string,
    amount: number,
    status: PaymentStatus,
    method: PaymentMethod
}

const getPaymentsByUser = async (userId: string): Promise<Payment[] | []> => {
    // Logic to fetch all payments from the 
    const payments = await PaymentRepository.findPaymentsByUserId(userId);

    if (!payments || payments.length === 0) {
        throw new AppError(404, "No payments found");
    }

    return payments;
}



const createPayment = async (data: {
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
}) => {
    const payment = await PaymentRepository.createPayment(data);
    return payment;
}



const deletePayment = async (id: string) => {

    const payment = await PaymentRepository.findPaymentById(id);

    if (!payment) {
        throw new AppError(404, "Payment not found");
    }
    return await PaymentRepository.deletePayment(id);
}


const getPaymentById = async (id: string) => {
    const payment = await PaymentRepository.findPaymentById(id);
    if (!payment) {
        throw new AppError(404, "Payment not found");
    }
    return payment;
}




export const PaymentService = {
    getPaymentsByUser,
    createPayment,
    deletePayment,
    getPaymentById
}



