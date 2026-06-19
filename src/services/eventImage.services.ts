import { EventImageRepository } from '@/src/repositories/eventImage.repository.js';
import AppError from "../utils/AppError.js";


interface EventImage {
    eventId: string
    url: string
    
}

const getEventImages = async (): Promise<EventImage[] | []> => {
    // Logic to fetch all event images
    const eventImages = await EventImageRepository.findEventImages();

    if (!eventImages || eventImages.length === 0) {
        throw new AppError(404, "No event images found");
    }

    return eventImages;
}



const createEventImage = async (data: {
    eventId: string
    url: string
    isPrimary: boolean
    createdAt: Date
}) => {
    const eventImage = await EventImageRepository.createEventImages(data);
    return eventImage;
}



const deleteEventImage = async (id: number) => {

    const eventImage = await EventImageRepository.findEventImageById(id);

    if (!eventImage) {
        throw new AppError(404, "Event image not found");
    }
    return await EventImageRepository.deleteEventImage(id);
}


const getEventImageById = async (id: number) => {
    const eventImage = await EventImageRepository.findEventImageById(id);
    if (!eventImage) {
        throw new AppError(404, "Event image not found");
    }
    return eventImage;
}




export const EventImageService = {
    getEventImages,
    createEventImage,
    deleteEventImage,
    getEventImageById
}



