import { db } from '@/src/utils/db.js';


const findEventCategories = () => {

    const Categories = db.eventCategories.findMany({
        select: {
            id: true,
            name: true,
        }

    })
    return Categories;

}

const findEventCategoryById = async (id: number) => {
    return db.eventCategories.findUnique({
        where: {
            id
        }
    })

}



export const createEventCategory = (data:
    {
        name: string,
    }
) => {
    return db.eventCategories.create({
        data
    }
    )
}


export const createManyEventCategories = async (data: {
    name: string;
}[]) => {
    return db.eventCategories.createMany({
        data
    })
}


export const deleteEventCategory = async (id: number) => {
    return db.eventCategories.delete({
        where: {
            id
        }
    })
}



export const EventCategoryRepository = {
    findEventCategories,
    findEventCategoryById,
    createEventCategory,
    createManyEventCategories,
    deleteEventCategory
}