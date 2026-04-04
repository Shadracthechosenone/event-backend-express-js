
import { findEventsByUserId } from '@/src/repositories/events.repository.js';
import AppError from "../utils/Apperror.js";


interface Event {
    name: string;
    id: number;
    description: string | null;
    date?: Date;
    userId?: number;
}

const getEventsByUser = async (userId:number): Promise<Event[]|[]> => {
    // Logic to fetch all events from the 
    const events = await findEventsByUserId(userId);

        if (!events || events.length === 0) {
            throw new AppError(404, "No events found");
        }
        
    return events;
}

export const EventService = {
    getEventsByUser
}