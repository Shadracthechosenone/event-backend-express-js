import { NotificationService } from "../services/notifications.services.js"
import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';




const getNotificationsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError(401, "Unauthorized, please log in");
    }
    const notifications = await NotificationService.getNotificationsByUser(userId);

    sendResponse(res, 200, {
        message: "Notifications retrieved successfully",
        data: {
            notifications
        },

    })
})

const deleteNotification = asyncHandler(async (req, res) => {
    const reviewId = req.params.id;

    if (typeof reviewId !== "string") {
        throw new AppError(400, "Invalid review ID");
    }

    await NotificationService.deleteNotification(reviewId);
    sendResponse(res, 200, {
        message: "Notification deleted successfully",
    });
})


const createNotification = asyncHandler(async (req, res, next) => {

    // ajouter catch pour passer les erreurs a global error handler
    try {


        const {
            userId,
            eventId,
            type,
            title,
            body,
            read,
            data,
            createdAt
        } = req.body;

        const notification = await NotificationService.createNotification({
            userId,
            eventId,
            type,
            title,
            body,
            read,
            data,
            createdAt
        });
        sendResponse(res, 201, {
            message: "Notification created successfully",
            data: {
                notification
            }
        })
    } catch (error) {
        next(error);
    }
})



const getNotificationById = asyncHandler(async (req, res) => {
    const NotificationId = req.params.id;
    if (typeof NotificationId !== "string") {
        throw new AppError(400, "Invalid notification ID");
    }

    const notification = await NotificationService.getNotificationById(NotificationId);

    sendResponse(res, 200, {
        message: "Notification retrieved successfully",
        data: {
            notification
        }
    });
})

export const notificationController = {
    getNotificationsByUserId,
    getNotificationById,
    createNotification,
    deleteNotification


}