
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
    userId: number,
    email?: string
}

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const REFRESH_KEY = process.env.JWT_REFRESH_KEY;



export const generateToken = (payload: TokenPayload) => {

    if (!SECRET_KEY || !REFRESH_KEY) {
        throw new Error("JWT secrets are not properly configured");
    }
    const acesstoken = jwt.sign(payload, SECRET_KEY as string, { expiresIn: '1m' })
    const refreshtoken = jwt.sign(payload, REFRESH_KEY, { expiresIn: '7d' })
    return { acesstoken, refreshtoken };
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
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
        },
    }
}



export const login = async (body: {email:string,password:string}): Promise<{
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
        throw new AppError(400,"Email ou mot de passe incorrect");
    }


    const payload: TokenPayload = { userId: existingUser.id, email: existingUser.email };
    const { acesstoken: token, refreshtoken } = generateToken(payload);

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

export const AuthService = {
    registerUser,
    login,
    generateToken
}