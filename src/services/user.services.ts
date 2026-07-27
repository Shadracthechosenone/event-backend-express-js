import { UserRepository } from '@/src/repositories/user.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma, TicketStatus, ROLE } from "@prisma/client";


interface User {

    id: string
    name: string

}


type updateUser = {
    name: string,
    email: string,
    phone: string,
    role: ROLE
}


const getUserById = async (userId: string): Promise<User | null> => {
    // Logic to fetch all tickets from the 
    const users = await UserRepository.findUserInfoById(userId);

    if (!users) {
        throw new AppError(404, "User not found");
    }

    return users;
}

const getAllUsers = async (): Promise<User[] | []> => {
    const users = await UserRepository.findAllUSers();
    if (!users || users.length === 0) {
        throw new AppError(404, "No users found");
    }

    return users;
}


const createUser = async (data: { name: string; email: string; password: string,phone:string, role: ROLE }) => {
    const user = await UserRepository.createUser(data);
    return user;
}


const updateUser = async (id: string, data: updateUser) => {
    const updatedUser = await UserRepository.updateUser(id, data)
    return updatedUser
};


const deleteUser = async (id: string) => {

    const user = await UserRepository.findUserById(id)
    if (!user) {
        throw new AppError(404, "User not found");

    }
    return await UserRepository.deleteUser(id)


}
export const UserService = {
    getUserById,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}
