import sendResponse from "../utils/sendResponse.js";
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { UserService } from "../services/user.services.js";




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

export const userController = {
    getUsers,
    getUserById
};

