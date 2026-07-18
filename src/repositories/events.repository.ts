
import { db } from '@/src/utils/db.js';
import { Prisma, EventStatus } from "@prisma/client";


interface UpdateEventData {
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
  status?: "ACTIVE" | "INACTIVE" | "CANCELLED" | "COMPLETED";
}


const findAllEvents = () => {

  const events = db.event.findMany({
    select: {
      id: true,
      name: true,
    }

  })
  return events;

}

export const findEventsByUserId = (id: string) => {

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

const findPastEventsByUserId = (id: string) => {

  const events = db.event.findMany({
    where: {
      userId: id,
      date: {
        lt: new Date()
      }
    },
    select: {
      id: true,
      name: true,
      description: true
    }
  })
  return events;
}


const findUpcomingEventsByUserId = async (id: string) => {

  const events = db.event.findMany({
    where: {
      userId: id,
      date: {
        gt: new Date()
      }
    },
    select: {
      id: true,
      name: true,
      description: true
    }
  })
  return events;
}





export const findManyEvents = async (params: {
  where?: Prisma.EventWhereInput & { categoryName?: string };
  orderBy?:
  | Prisma.EventOrderByWithRelationInput
  | Prisma.EventOrderByWithRelationInput[];
  skip?: number;
  take?: number;
  select?: Prisma.EventSelect;
}) => {
  const {
    where = {},
    orderBy = { createdAt: "desc" },
    skip,
    take,
    select,
  } = params;

  const { categoryName, ...restWhere } = where;
  console.log("skip, take, orderBy in repository", skip, take, orderBy)

  const finalWhere: Prisma.EventWhereInput = {
    ...restWhere,
    ...(categoryName
      ? {
        category: {
          is: {
            name: {
              equals: categoryName,
              mode: "insensitive",
            },
          },
        },
      }
      : {}),
  };

  const queryOptions: any = {
    where: finalWhere,
    orderBy,
    skip,
    take,
  };

  if (select) {
    queryOptions.select = select;
  } else {
    queryOptions.include = {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      participants: true,
    };
  }

  return db.event.findMany(queryOptions);
};


export const countEvents = async (params: {
  where?: Prisma.EventWhereInput & { categoryName?: string };
}) => {
  const { where = {} } = params;
  const { categoryName, ...restWhere } = where;

  const finalWhere: Prisma.EventWhereInput = {
    ...restWhere,
    ...(categoryName
      ? {
        category: {
          is: {
            name: {
              equals: categoryName,
              mode: "insensitive",
            },
          },
        },
      }
      : {}),
  };

  return db.event.count({ where: finalWhere });
};


const findEventById = async (id: string) => {

  return db.event.findUnique({
    where: {
      id
    },
    include: {
      participants: true
    }
  })

}


export const createEvent = (data:
  {
    name: string;
    description?: string;
    userId: string;
    address?: string;
    startAt: Date;
    endAt: Date;
    eventCategoriesId: number;
    latitude: number;
    longitude: number;
    maxCapacity?: number;
    ticketPrice: number;
    capacity?: number;
  }
) => {
  const { maxCapacity, ...restData } = data
  return db.event.create({
    data: {
      ...restData,
      maxCapacity: maxCapacity,
      capacity: maxCapacity ?? null,
    }
  }
  )
}


export const createManyEvents = async (data: {
  name: string;
  description?: string;
  userId: string;
  address?: string;
  startAt: Date;
  endAt: Date;
  eventCategoriesId: number;
  latitude: number;
  longitude: number;
  capacity?: number;
  maxCapacity?: number;
}[]) => {
  return db.event.createMany({
    data: data.map((event) => {
      const { maxCapacity, ...rest } = event;
      return {
        ...rest,
        maxCapacity: maxCapacity,
        capacity: maxCapacity ?? null,
      };
    })
  })
}


export const deleteEvent = async (id: string) => {
  return db.event.delete({
    where: {
      id
    }
  })
}



export const updateEvent = (
  id: string,
  data: UpdateEventData
) => {
  return db.event.update({
    where: { id },
    data,
  });
};

const findAvailablePlacesByEventId = async (eventId: string) => {

  const seats = await db.event.findUnique({
    where: {
      id: eventId
    },

    select: {
      capacity: true,
    }

  }
  )

  return seats?.capacity ?? null;
}

/* repository functions for finding events in a bounding box and nearby a point
Map for location   
*/

// Événements dans un rectangle (bounding box) — pour l'affichage carte
const findEventsInBoundingBox = (bounds: {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  status?: EventStatus;
}) => {
  const events = db.event.findMany({
    where: {
      latitude: { gte: bounds.swLat, lte: bounds.neLat },
      longitude: { gte: bounds.swLng, lte: bounds.neLng },
      status: bounds.status ?? "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      startAt: true,
      isFree: true,
      ticketPrice: true,
      eventCategoriesId: true,
      images: {
        where: { isPrimary: true },
        select: { url: true },
        take: 1,
      },
    },
    take: 200, // limite de sécurité, voir clustering plus bas
  });
  return events;
}

// Événements proches d'un point (lat/lng) avec rayon en km — pour "près de moi"
// Formule de Haversine directement en SQL (pas besoin de PostGIS)
const findEventsNearby = (params: {
  lat: number;
  lng: number;
  radiusKm: number;
  limit?: number;
}) => {
  const { lat, lng, radiusKm, limit = 100 } = params;

  // requête brute car Prisma ne supporte pas nativement le calcul de distance
  const events = db.$queryRaw`
        SELECT
            id, name, latitude, longitude, "startAt", "isFree", "ticketPrice",
            (
                6371 * acos(
                    cos(radians(${lat})) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(${lng})) +
                    sin(radians(${lat})) * sin(radians(latitude))
                )
            ) AS distance_km
        FROM "Event"
        WHERE status = 'ACTIVE'
        HAVING (
            6371 * acos(
                cos(radians(${lat})) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(${lng})) +
                sin(radians(${lat})) * sin(radians(latitude))
            )
        ) <= ${radiusKm}
        ORDER BY distance_km ASC
        LIMIT ${limit};
    `;
  return events;
}

export { findEventsInBoundingBox, findEventsNearby };


const updateCapacity = async (id: string, data: { seat: number },
  tx?: Prisma.TransactionClient
) => {
  const client = tx ?? db
  return client.event.update({
    data: {
      capacity: data.seat - 1
    },
    where: {
      id
    },
    select: {
      id: true,
      capacity: true
    }
  }
  )

}

const findRevenue = () => {

  const sum = db.event.aggregate({

    _sum: {
      ticketPrice: true
    }

  })

  return sum ;
}



const findActiveEvents = ()=>{

  const events = db.event.findMany({
    where: {
      status: "ACTIVE"
    },

    select: {
      id: true,
      name: true, }

  })
  return events;

}



export const eventsRepository = {
  findAllEvents,
  findEventsByUserId,
  findPastEventsByUserId,
  findUpcomingEventsByUserId,
  findManyEvents,
  countEvents,
  findEventById,
  createEvent,
  createManyEvents,
  deleteEvent,
  updateEvent,
  findAvailablePlacesByEventId,
  findEventsInBoundingBox,
  findEventsNearby,
  updateCapacity,
  findRevenue

}   