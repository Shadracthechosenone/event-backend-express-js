
import { db } from '@/src/utils/db.js';

const findAllEvents = () => {

    const events = db.event.findMany({
        select: {
            id: true,
            name: true,
        }

    })
    return events;

}

export const findEventsByUserId = (id: number) => {

    const events = db.event.findMany({
        where: {
            userId: id
        },
        select: {

            id: true,
            name: true,
            description: true
        }
    })
    return events;
}

export const eventsRepository = {
    findAllEvents,
    findEventsByUserId
}   