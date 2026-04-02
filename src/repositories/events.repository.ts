
import { db } from '@/src/utils/db.js';

const getAllevents = () => {

    const events = db.event.findMany({
        select: {
            id: true,
            name: true,
        }

    })
    return events;

}

const getAllEventsbyUserId = (id: number) => {

    const events = db.event.findMany({
        where: {
            id: id
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
    getAllevents,
    getAllEventsbyUserId
}   