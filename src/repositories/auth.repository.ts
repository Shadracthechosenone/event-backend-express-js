// auth.repository.ts
import { ROLE } from "@prisma/client";
import {db} from "@/src/utils/db.js";

export const authRepository = {
  async findUserByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  },

  async findUserByEmailWithPassword(email: string) {
    return db.user.findUnique({
      where: { email },
      
      select: {
        id: true,
        password: true,
        role: true,
        name: true,
        email: true,
      },
    });
  },

  async findUserById(id: number) {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },

  async createUser(data: {
    email: string;
    name: string;
    password: string;
    role: ROLE;
  }) {
    return db.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },

  async updateUserEmailVerification(
    userId: number,
    data: {
      emailVerificationToken: string | null;
      emailVerificationTokenExpiresAt: Date | null;
      emailVerified?: boolean;
    }
  ) {
    return db.user.update({
      where: { id: userId },
      data,
    });
  },

  async updateUserPasswordReset(
    email: string,
    data: {
      resetPasswordToken?: string | null;
      resetPasswordTokenExpiresAt?: Date | null;
      password?: string;
    }
  ) {
    return db.user.update({
      where: { email },
      data,
    });
  },

  async findUserByResetToken(hashedToken: string) {
    return db.session.findFirst({
      where: {
        refreshToken: hashedToken,
        expiresAt: { gt: new Date() },
      },
    });
  },

  async updateUserPassword(userId: number, password: string) {
    return db.user.update({
      where: { id: userId },
      data: {
        password,
       
      },
    });
  },

 /* async invalidateRefreshToken(refreshToken: string) {
    return db.session.update({
      where: { refreshToken },
      data: { refreshToken: null},
    });
  }*/

};