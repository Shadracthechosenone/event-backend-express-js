
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { db } from "@/src/utils/db.js";
import { authRepository } from "../repositories/auth.repository.js";
import { ROLE } from "@prisma/client";
import BadRequestError from "../utils/BadRequestError.js";
import AppError from "../utils/Apperror.js";



type AuthProps = {
    name: string
    email: string
    password: string
}


type TokenPayload = {
    id: number,
    email?: string
}




export const generateToken = (payload: TokenPayload) => {
    const SECRET_KEY = process.env.JWT_SECRET;
    const REFRESH_KEY = process.env.JWT_REFRESH_SECRET;


    if (!SECRET_KEY || !REFRESH_KEY) {
        throw new Error("JWT secrets are not properly configured");
    }
    const accesstoken = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' })
    const refreshtoken = jwt.sign(payload, REFRESH_KEY, { expiresIn: '7d' })
    return { accesstoken, refreshtoken };
}


export const registerUser = async (body: AuthProps) => {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const existingUser = await authRepository.findUserByEmail(body.email);

    if (existingUser) {
        return {
            error: "Email existe deja",
            status: 400
        };

    };

    const user = await authRepository.createUser({
        email: body.email,
        name: body.name,
        password: hashedPassword,
        role: "USER"
    });


    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    }
}



export const login = async (body: { email: string, password: string }): Promise<{
    user: {
        id: string;
        role: ROLE;
        name: string;
        email: string;
    },
    accessToken: string,
    refreshToken: string
}> => {
    const existingUser = await authRepository.findUserByEmailWithPassword(body.email);
    if (!existingUser) {
        throw new BadRequestError("Email ou mot de passe incorrect");
    }

    const passwordMatch = await bcrypt.compare(body.password, existingUser.password);


    if (!passwordMatch) {
        throw new AppError(400, "Email ou mot de passe incorrect");
    }


    const payload: TokenPayload = { id: existingUser.id, email: existingUser.email };
    const { accesstoken: token, refreshtoken } = generateToken(payload);

    // Créer la session en base

    await db.session.create({

        data: {
            userId: existingUser.id,
            refreshToken: refreshtoken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expire dans 7 jours
        }
    })

    return {
        user: {
            id: existingUser.id.toString(),
            role: existingUser.role,
            name: existingUser.name,
            email: existingUser.email,
        },

        accessToken: token,
        refreshToken: refreshtoken

    };

}



const refreshToken = async (OldrefreshToken: string): Promise<{ user: TokenPayload, accessToken: string, refreshToken: string }> => {
    const REFRESH_KEY = process.env.JWT_REFRESH_SECRET;
    if (!REFRESH_KEY) {
        throw new Error("JWT refresh secret is not defined in environment variables");
    }


    try {
        const decoded = jwt.verify(OldrefreshToken, REFRESH_KEY) as TokenPayload;

        const session = await db.session.findFirst({
            where: {
                refreshToken: OldrefreshToken,
                expiresAt: { gt: new Date() },
            },
        });

        if (!session) {
            throw new AppError(401, "Invalid refresh token");
        }

        const payload: TokenPayload = { id: decoded.id, email: decoded.email };
        const { accesstoken, refreshtoken } = generateToken(payload);
        await db.session.update({
            where: { id: session.id },
            data: {
                refreshToken: refreshtoken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // expire dans 7 jours
            },
        });

        return { user: payload, accessToken: accesstoken, refreshToken: refreshtoken };
    } catch (error) {
        throw new AppError(401, "Invalid refresh token");
    }
}


const resetUserPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {

    const user = await authRepository.findUserByResetToken(token);

    if (!user) {
        throw new AppError(400, "Invalid or expired password reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await authRepository.updateUserPassword(user.userId, hashedPassword);

    return { message: "Password reset successful" };

}


async function signOut(): Promise<{ message: string }> {
    return { message: "User signed out successfully" };
}

async function forgotPassword(email: string): Promise<{ message: string }> {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError(400, "No user found with that email");
    }

    // Generate a password reset token and save it to the database
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "default_secret", { expiresIn: '1h' });
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await authRepository.updateUserPasswordReset(email, {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // expire dans 1 heure
    });

    // Send the reset token to the user's email (implementation not shown)

    return { message: "Password reset token sent to email" };
}






export const AuthService = {
    registerUser,
    login,
    generateToken,
    refreshToken,
    resetUserPassword,
    forgotPassword,
    signOut
}

