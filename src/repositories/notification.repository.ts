import { db } from '@/src/utils/db.js';
import { Prisma, NotificationType } from "@prisma/client";



const findAllNotifications = () => {

    const Notifications = db.notification.findMany({
        select: {
            id: true,
            userId: true,
            title: true,
        }

    })
    return Notifications;

}

const findNotificationById = async (id: string) => {
    console.log("Fetching notification with ID:", id);

    return db.notification.findUnique({
        where: {
            id
        }
    })

}

const findNotificationsByUserId = async (userId: string) => {
    return db.notification.findMany({
        where: {
            userId
        }
    })
}

const findNotificationsByEventId = async (eventId: string) => {
    return db.notification.findMany({
        where: {
            eventId
        }
    })

}







export const createNotification = (data: {
    userId: string;
    eventId?: string;
    type: NotificationType;
    title: string;
    body: string;
    read: boolean;
    data?: Prisma.InputJsonValue;
    createdAt: Date;

}) => {
    return db.notification.create({
        data
    });
};




export const createManyNotifications = async (data: {
    userId: string;
    eventId?: string;
    type: NotificationType;
    title: string;
    body: string;
    read: boolean;
    data?: Prisma.InputJsonValue;
    createdAt: Date;
}[]) => {
    return db.notification.createMany({
        data
    })
}


export const deleteNotification = async (id: string) => {
    return db.notification.delete({
        where: {
            id
        }
    })
}



export const NotificationRepository = {
    findAllNotifications,
    findNotificationById,
    findNotificationsByUserId,
    findNotificationsByEventId,
    createNotification,
    createManyNotifications,
    deleteNotification
}
