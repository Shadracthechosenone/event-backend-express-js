
import { db } from '@/src/utils/db.js';
import { Prisma } from "@prisma/client";


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

const findPastEventsByUserId = (id: number) => {

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


const findUpcomingEventsByUserId = async (id: number) => {

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
        EventCategories: {
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      EventCategories: true,
      EventParticipants: true,
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
        EventCategories: {
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


const findEventById = async (id: number) => {
  console.log("Fetching event with ID:", id);

  return db.event.findUnique({
    where: {
      id
    }
  })

}


export const createEvent = async (data:
  {
    name: string;
    description?: string;
    userId: number;
    address?: string;
    startAt: Date;
    endAt: Date;
    eventCategoriesId?: number;
    latitude: number;
    longitude: number;
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
  userId: number;
  address?: string;
  startAt: Date;
  endAt: Date;
  eventCategoriesId: number;
  latitude: number;
  longitude: number;
}[]) => {
  return db.event.createMany({
    data
  })
}


export const deleteEvent = async (id: number) => {
  return db.event.delete({
    where: {
      id
    }
  })
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
  deleteEvent

}   