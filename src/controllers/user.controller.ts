import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { UserService } from "../services/user.services.js";
import { ROLE } from "@prisma/client";

type User = {
    name: string;
    email: string,
    phone: string,
    password?: string,
    role: ROLE
};



const getUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();

    sendResponse(res, 200, {
        message: "Users retrieved successfully",
        data: {
            users
        }
    });
});

const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    if (typeof userId !== "string") {
        throw new AppError(400, "Invalid user ID");
    }

    const user = await UserService.getUserById(userId);

    sendResponse(res, 200, {
        message: "User retrieved successfully",
        data: {
            user
        }
    });
});


const createUser = asyncHandler(async (req, res) => {
    const { name, email, phone,role }: User = req.body;

    const password = "test@pass"

    const newUser = await UserService.createUser({ name, email, password,phone, role });

    sendResponse(res, 201, {
        message: "User created successfully",
        data: {
            user: newUser
        }
    });
})


const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id as string
    const { name, email, phone, role } = req.body
    const updatedUser = await UserService.updateUser(userId, { name, email, phone, role });
    sendResponse(res, 200, {
        message: "User created successfully",
        data: {
            user: updatedUser
        }
    });
})


const deleteUser = asyncHandler(async (req, res) => {

    const userId = req.params.id;

    if (typeof userId !== "string") {
        throw new AppError(400, "Invalid user ID");
    }

    await UserService.deleteUser(userId);
    sendResponse(res, 200, {
        message: "Event deleted successfully",
    });



})



export const userController = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};

