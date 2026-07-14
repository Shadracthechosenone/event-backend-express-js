import { UserRepository } from '@/src/repositories/user.repository.js';
import AppError from "../utils/AppError.js";
import { Prisma, TicketStatus } from "@prisma/client";


interface User {

    id: string
    name: string

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


export const UserService = {
    getUserById,
    getAllUsers
}
