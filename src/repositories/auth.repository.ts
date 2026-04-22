// auth.repository.ts
import { ROLE } from "@prisma/client";
import { db } from "@/src/utils/db.js";

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

  async findUserById(id: string) {
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
    userId: string,
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
      tokenHash?: string ;
      expiresAt?: Date;
      used?: boolean;

    }
  ) {

    const user = await authRepository.findUserByEmail(email)
    const userId = user?.id;
    if (!userId) {
      throw new Error("User not found with the provided email");
    } // check here after

    return db.passwordResetToken.update({
      where: {userId },
      data
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

  async updateUserPassword(userId: string, password: string) {
    return db.user.update({
      where: { id: userId },
      data: {
        password,

      },
    });
  },

  async invalidateRefreshToken(refreshToken: string | undefined) {

    if (!refreshToken) {
      throw new Error("Refresh token is required for logout");
    }

    return db.session.update({
      where: { refreshToken },
      data: { refreshToken: null },
    });
  }

};