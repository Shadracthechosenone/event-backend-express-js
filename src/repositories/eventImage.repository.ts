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
        createdAt: Date
    }
) => {
    return db.eventImage.create({
        data
    }
    )
}


export const createManyEventImages = async (data: {
    id: number,
    eventId: string,
    url: string,
    isPrimary: boolean,
    createdAt: Date
}[]) => {
    return db.eventImage.createMany({
        data
    })
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
    deleteEventImage
}