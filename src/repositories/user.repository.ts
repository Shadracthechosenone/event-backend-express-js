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

const findUserInfoById = async (userId: string) => {

    const user = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true}    
        })
    return user
}



const findAllUSers = async () => {
    const users = await db.user.findMany({
        select: {
            id: true,
            name:true}
    })
    return users
}

export const UserRepository = {
    findUserById,
    findAllUSers,
    findUserInfoById
}