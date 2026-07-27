import { db } from '@/src/utils/db.js';
import { ROLE } from "@prisma/client";



type updateUser = {
    name:string,
    email:string,
    phone:string,
    role:ROLE
}




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
            name: true
        }
    })
    return user
}



const findAllUSers = async () => {
    const users = await db.user.findMany({
        select: {
            id: true,
            name: true,
            email:true,
            phone:true,
            role:true

        },
        orderBy:{
            createdAt:"desc"
        }
    })
    return users
}


const createUser = async (data: { name: string; email: string; password: string,phone:string, role: ROLE }) => {
    const user = await db.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            phone:data.phone,
            role: data.role ? data.role : ROLE.USER

        },
        select:{
            id:true,
            name:true,
            email:true,
            phone:true,
            role:true
        }
    })
    return user
}


const updateUser = async(id:string,data:updateUser) => {
    return db.user.update({
        where:{id},
        data
    })

};


const deleteUser = async(id:string)=>{

    return db.user.delete({
        where:{
            id
        }
    })

}

export const UserRepository = {
    findUserById,
    findAllUSers,
    findUserInfoById,
    createUser,
    updateUser,
    deleteUser
}