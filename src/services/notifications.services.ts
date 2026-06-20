import { NotificationRepository } from '@/src/repositories/notification.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma, NotificationType } from "@prisma/client";


interface Notification {

    userId: string
    eventId: string | null
    type: NotificationType
    title: string
    body: string
    read: boolean
    data: Prisma.InputJsonValue | null
    createdAt: Date
}

const getNotificationsByUser = async (userId: string): Promise<Notification[] | []> => {
    // Logic to fetch all notifications from the
    const notifications = await NotificationRepository.findNotificationsByUserId(userId);

    if (!notifications || notifications.length === 0) {
        throw new AppError(404, "No notifications found");
    }

    return notifications;
}



const createNotification = async (data: {
    userId: string
    eventId?: string
    type: NotificationType
    title: string
    body: string
    read: boolean
    data?: Prisma.InputJsonValue
    createdAt: Date
}) => {
    const notification = await NotificationRepository.createNotification(data);
    return notification;
}





const deleteNotification = async (id: string) => {

    const notification = await NotificationRepository.findNotificationById(id);

    if (!notification) {
        throw new AppError(404, "Notification not found");
    }
    return await NotificationRepository.deleteNotification(id);
}


const getNotificationById = async (id: string) => {
    const notification = await NotificationRepository.findNotificationById(id);
    if (!notification) {
        throw new AppError(404, "Notification not found");
    }
    return notification;
}



export const NotificationService = {
    getNotificationsByUser,
    createNotification,
    deleteNotification,
    getNotificationById
}
