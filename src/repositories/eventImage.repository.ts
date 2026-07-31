import { db } from '@/src/utils/db.js';


const findEventImages = () => {

    const Images = db.eventImage.findMany({
        select: {
            id: true,
            url: true,
            eventId: true
        }
    })
    return Images;
}


const findEventImagesByEventId = async (eventId: string) => {
    return db.eventImage.findMany({
        where: { eventId },
        select: {
            id: true,
            url: true,
            eventId: true,
            publicId: true,
            type: true,
            isPrimary: true,
            createdAt: true,
        },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
};


const eventExists = async (eventId: string) => {
    const event = await db.event.findUnique({ where: { id: eventId } });
    return !!event;
};

const createEventImage = async (data: {
    eventId: string;
    url: string;
    publicId: string;
    type: string;
    isPrimary?: boolean;
    format?: string;
    bytes?: number;
    originalName?: string;
}) => {
    return db.eventImage.create({ data });
};

// createMany ne renvoie pas les lignes créées, donc on boucle pour
// pouvoir renvoyer les URLs/ids directement au frontend après upload
const createManyEventImages = async (
    dataArray: {
        eventId: string;
        url: string;
        publicId: string;
        type: string;
        isPrimary?: boolean;
        format?: string;
        bytes?: number;
        originalName?: string;
    }[]
) => {
    return Promise.all(dataArray.map((data) => createEventImage(data)));
};

const unsetPrimaryForEvent = async (eventId: string) => {
    return db.eventImage.updateMany({
        where: { eventId, isPrimary: true },
        data: { isPrimary: false },
    });
};

const setPrimary = async (id: number) => {
    return db.eventImage.update({
        where: { id },
        data: { isPrimary: true },
    });
};

//plus

const findEventImageById = async (id: number) => {
    return db.eventImage.findUnique({
        where: {
            id
        }
    })
}




export const createEventImages = (data:
    {
        eventId: string,
        url: string,
        isPrimary: boolean,
        createdAt: Date,
        publicId: string
    }
) => {
    return db.eventImage.create({
        data
    }
    )
}




export const deleteEventImage = async (id: number) => {
    return db.eventImage.delete({
        where: {
            id
        }
    })
}



export const EventImageRepository = {
    findEventImages,
    findEventImageById,
    createEventImages,
    createManyEventImages,
    deleteEventImage,
    findEventImagesByEventId,
    eventExists,
    createEventImage,
    unsetPrimaryForEvent,
    setPrimary,

}