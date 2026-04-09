
import { countEvents, findEventsByUserId } from '@/src/repositories/events.repository.js';
import AppError from "../utils/Apperror.js";
import { Prisma } from "@prisma/client";
import {findManyEvents} from "@/src/repositories/events.repository.js";
import ApiFeatures from '../utils/ApiFeatures.js';


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



export const getEvents = async (queryString: Record<string, any>) => {
  const apiFeatures = new ApiFeatures(queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .build();

  const { where, orderBy, skip, take, select } = apiFeatures;

  const finalWhere: Prisma.EventWhereInput & { categoryName?: string } =
    where && Object.keys(where).length > 0 ? where : {};

  const totalResults = await countEvents({ where: finalWhere });

  const totalPages = Math.ceil(totalResults / take);
  const currentPage = Math.floor(skip / take) + 1;

  const events = await findManyEvents({
    where: finalWhere,
    orderBy: orderBy || { createdAt: "desc" },
    skip,
    take,
    select,
  });

  return {
    events,
    totalResults,
    totalPages,
    currentPage,
    resultsPerPage: take,
  };
};




export const EventService = {
    getEventsByUser,
    getEvents
}