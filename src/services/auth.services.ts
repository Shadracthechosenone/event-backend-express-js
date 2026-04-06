
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



const refreshToken = async (OldrefreshToken: string) => {
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

        return { user:payload,accessToken: accesstoken, refreshToken: refreshtoken };
    } catch (error) {
        throw new AppError(401, "Invalid refresh token");
    }
}

export const AuthService = {
    registerUser,
    login,
    generateToken
}