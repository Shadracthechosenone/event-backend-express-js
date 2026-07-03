
import { countEvents, eventsRepository, findEventsByUserId, findManyEvents } from '@/src/repositories/events.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma,EventStatus } from "@prisma/client";
import ApiFeatures from '../utils/ApiFeatures.js';


interface Event {
  name: string;
  id: string;
  description: string | null;
  date?: Date;
  userId?: string;
}


interface UpdateEventDto {
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  startAt?: Date;
  endAt?: Date;
  ticketPrice?: number;
  maxCapacity?: number;
  eventCategoriesId?: number;
  isFree?: boolean;
}

const getEventsByUser = async (userId: string): Promise<Event[] | []> => {
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


const createEvent = async (data: {
  name: string;
  description?: string;
  userId: string;
  startAt: Date;
  endAt: Date;
  address?: string;
  latitude: number;
  longitude: number;
  eventCategoriesId: number;
  ticketPrice: number;
  maxCapacity?: number;
  capacity?: number;
}) => {
  const event = await eventsRepository.createEvent(data);
  return event;
}





const deleteEvent = async (id: string) => {

  const event = await eventsRepository.findEventById(id);

  if (!event) {
    throw new AppError(404, "Event not found");
  }
  return await eventsRepository.deleteEvent(id);
}


const getEventbyId = async (id: string) => {
  const event = await eventsRepository.findEventById(id);
  if (!event) {
    throw new AppError(404, "Event not found");
  }
  return event;
}


export const updateEvent = async (
  eventId: string,
  userId: string,
  data: UpdateEventDto
) => {
  // 1. Vérifier que l'événement existe
  const event = await eventsRepository.findEventById(eventId);

  if (!event) {
    throw new Error("Événement introuvable");
  }

  // 2. Vérifier que l'utilisateur est l'organisateur
  if (event.userId !== userId) {
    throw new Error(
      "Vous n'êtes pas autorisé à modifier cet événement"
    );
  }

  // 3. Empêcher la modification d'un événement terminé
  if (
    event.status === EventStatus.COMPLETED ||
    new Date(event.endAt) < new Date()
  ) {
    const forbiddenFields = [
      "startAt",
      "endAt",
      "ticketPrice",
      "maxCapacity",
      "isFree",
      "eventCategoriesId",
    ];

    const hasForbiddenUpdate = forbiddenFields.some(
      (field) => field in data
    );

    if (hasForbiddenUpdate) {
      throw new Error(
        "Cet événement est terminé et ne peut plus être modifié"
      );
    }
  }
  
  // 4. Validation des dates
  const startAt = data.startAt ?? event.startAt;
  const endAt = data.endAt ?? event.endAt;

  if (new Date(startAt) >= new Date(endAt)) {
    throw new Error(
      "La date de fin doit être postérieure à la date de début"
    );
  }

  // 5. Empêcher le passage gratuit → payant après inscriptions
  const hasParticipants = (event.participants?.length ?? 0) > 0;

  if (
    hasParticipants &&
    event.isFree &&
    data.isFree === false
  ) {
    throw new Error(
      "Impossible de transformer un événement gratuit en événement payant après les inscriptions"
    );
  }

  // 6. Validation du prix
  if (data.ticketPrice !== undefined && data.ticketPrice < 0) {
    throw new Error(
      "Le prix du ticket ne peut pas être négatif"
    );
  }

  // 7. Validation de la capacité
  if (
    data.maxCapacity !== undefined &&
    data.maxCapacity !== null
  ) {
    const currentParticipants =
      event.participants?.length ?? 0;

    if (data.maxCapacity < currentParticipants) {
      throw new Error(
        `La capacité maximale ne peut pas être inférieure au nombre actuel de participants (${currentParticipants})`
      );
    }
  }

  // 8. Si l'événement devient gratuit
  if (data.isFree === true) {
    data.ticketPrice = 0;
  }

  // 9. Mise à jour
  const updatedEvent = await eventsRepository.updateEvent(eventId, data);

  return updatedEvent;
};


// services for events mapping and nearby search

const getAvailablePlacesByEventId = async (eventId: string) => {

  const seats = await eventsRepository.findAvailablePlacesByEventId(eventId);

  if (!seats) {
    throw new AppError(404, "seats not found");
  }

  return seats;}


const getEventsInViewport = (bounds: {
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
}) => {
    // garde-fou : éviter qu'un client demande toute la planète d'un coup
    const latSpan = bounds.neLat - bounds.swLat;
    const lngSpan = bounds.neLng - bounds.swLng;
    if (latSpan > 5 || lngSpan > 5) {
        throw new AppError(400, "Zone de recherche trop large");
    }

    return eventsRepository.findEventsInBoundingBox({ ...bounds, status: "ACTIVE" });
}

const getEventsNearby = (params: { lat: number; lng: number; radiusKm?: number }) => {
    const radiusKm = params.radiusKm ?? 10; // valeur par défaut raisonnable

    if (radiusKm > 100) {
        throw new AppError(400, "Le rayon de recherche ne peut pas dépasser 100 km");
    }

    return eventsRepository.findEventsNearby({ lat: params.lat, lng: params.lng, radiusKm });
}



export const EventService = {
  getEventsByUser,
  getEvents,
  deleteEvent,
  createEvent,
  getEventbyId,
  updateEvent,
  getAvailablePlacesByEventId,
  getEventsInViewport,
  getEventsNearby

}