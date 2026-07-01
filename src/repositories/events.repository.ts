
import { db } from '@/src/utils/db.js';
import { Prisma } from "@prisma/client";


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


export const createEvent =  (data:
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
  return db.event.create({
    data
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
}[]) => {
  return db.event.createMany({
    data
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
      id: eventId},

    select:{
      capacity: true,
    }
    
    }
    )

    return seats?.capacity??null;
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
  findAvailablePlacesByEventId

}   