// admin.controller.ts
import asyncHandler from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";
import { EventService } from "../services/events.services.js";
import { PaymentService } from "../services/payment.services.js";

const getAdminStats = asyncHandler(async (req, res): Promise<void> => {

    const [revenue, activeEvents, pendingPayments] = await Promise.all([
        EventService.getRevenue(),
        EventService.getActiveEvents(),
        PaymentService.getPaymentsByStatus("PENDING"),
    ]);

    sendResponse(res, 200, {
        message: "Admin stats fetched successfully",
        data: {
            totalRevenue: revenue ?? 0,
            activeEvents: {
                count: activeEvents.length,
                //list: activeEvents,
            },
            pendingPayments: {
                count: pendingPayments.length,
                //list: pendingPayments,
            },
        }
    });
});

export const adminController = {
    getAdminStats
};