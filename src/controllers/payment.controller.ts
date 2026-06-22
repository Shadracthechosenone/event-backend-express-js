import { PaymentService } from "../services/payment.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';




const getPaymentsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError(401, "Unauthorized, please log in");
    }
    const payments = await PaymentService.getPaymentsByUser(userId);

    sendResponse(res, 200, {
        message: "Payments retrieved successfully",
        data: {
            payments
        },

    })
})

const deletePayment = asyncHandler(async (req, res) => {
    const paymentId = req.params.id;

    if (typeof paymentId !== "string") {
        throw new AppError(400, "Invalid payment ID");
    }

    await PaymentService.deletePayment(paymentId);
    sendResponse(res, 200, {
        message: "Payment deleted successfully",
    });
})


const createPayment = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            eventId,
            userId,
            ticketId,
            amount,
            status,
            currency,
            transactionRef,
            failureReason,
            paidAt,
            method
        } = req.body;

        const payment = await PaymentService.createPayment({
            eventId,
            userId,
            ticketId,
            amount,
            status,
            currency,
            transactionRef,
            failureReason,
            paidAt,
            method
        })
        sendResponse(res, 201, {
            message: "Payment created successfully",
            data: {
                payment
            }
        })
    } catch (error) {
        next(error);
    }

})


const getPaymentById = asyncHandler(async (req, res) => {
    const paymentId = req.params.id;
    if (typeof paymentId !== "string") {
        throw new AppError(400, "Invalid payment ID");
    }

    const payment = await PaymentService.getPaymentById(paymentId);

    sendResponse(res, 200, {
        message: "Payment retrieved successfully",
        data: {
            payment
        }
    });
})

export const paymentController = {
    getPaymentsByUserId,
    getPaymentById,
    createPayment,
    deletePayment


}