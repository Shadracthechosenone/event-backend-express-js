import { Request, Response, NextFunction } from "express";
import AppError from "@/src/utils/AppError.js";

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError(401,"Vous devez être connecté pour accéder à cette ressource."));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(403,"Vous n'avez pas la permission d'effectuer cette action.")
            );
        }

        next();
    };
};