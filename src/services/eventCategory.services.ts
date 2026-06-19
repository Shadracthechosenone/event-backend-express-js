import { EventCategoryRepository } from '@/src/repositories/eventcategory.repository.js';
import AppError from "../utils/AppError.js";


interface EventCategories {
    name: string
}

const getEventCategories = async (): Promise<EventCategories[] | []> => {
    // Logic to fetch all event categories
    const eventCategories = await EventCategoryRepository.findEventCategories();

    if (!eventCategories || eventCategories.length === 0) {
        throw new AppError(404, "No event categories found");
    }

    return eventCategories;
}



const createEventCategory = async (data: {
    name: string
}) => {
    const eventCategory = await EventCategoryRepository.createEventCategory(data);
    return eventCategory;
}



const deleteEventCategory = async (id: number) => {

    const eventCategory = await EventCategoryRepository.findEventCategoryById(id);

    if (!eventCategory) {
        throw new AppError(404, "Event category not found");
    }
    return await EventCategoryRepository.deleteEventCategory(id);
}


const getEventCategoryById = async (id: number) => {
    const eventCategory = await EventCategoryRepository.findEventCategoryById(id);
    if (!eventCategory) {
        throw new AppError(404, "Event category not found");
    }
    return eventCategory;
}




export const EventCategoryService = {
    getEventCategories,
    createEventCategory,
    deleteEventCategory,
    getEventCategoryById
}



