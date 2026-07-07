import { db } from '@/src/utils/db.js';


const findUserById = async (userId: string) => {

    const user = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            email: true,
        }
    })
    return user?.email ?? null
}

export const UserRepository = {
    findUserById
}