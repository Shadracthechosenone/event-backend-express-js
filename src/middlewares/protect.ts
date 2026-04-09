import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "@/src/utils/Apperror.js";
import { User } from "@/src/types/userType.js";
import { db } from "@/src/utils/db.js";

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req?.get("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return next(new AppError(401, "Unauthorized, please log in"));
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(
      accessToken,
      secret
    ) as User;

  

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true },
    });

    if (!user) {
      return next(new AppError(401, "User no longer exists."));
    }

    req.user = { id: decoded.id, role: user.role };
    next();
  } catch (error) {
    console.log(error);
    return next(new AppError(401, "Invalid access token, please log in"));
  }
};

export default protect;