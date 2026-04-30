import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // correction ici
import { ZodError } from "zod";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
    PrismaClientInitializationError,
} from "@prisma/client/runtime/client.js";
import AppError from "./AppError.js"; //  import default
import { ValidationError } from "./httpErrors.js";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ErrorResponse {
    status: "error";
    statusCode: number;
    message: string;
    details?: unknown;
}

// ─── Prisma handler ───────────────────────────────────────────────────────────

function handlePrismaError(
    error: PrismaClientKnownRequestError
): Pick<ErrorResponse, "statusCode" | "message"> {
    switch (error.code) {
        case "P2002": {
            const field = (error.meta?.target as string[])?.[0] ?? "field";
            return {
                statusCode: 409,
                message: `${field} is already taken`,
            };
        }

        case "P2025":
            return {
                statusCode: 404,
                message: (error.meta?.cause as string) ?? "Record not found",
            };

        case "P2003": {
            const driverError = error.meta?.driverAdapterError as any;
            const constraint = driverError?.cause?.constraint;

            const rawConstraint: string =
                typeof constraint === "string"
                    ? constraint
                    : (constraint?.name ?? constraint?.index ?? "") as string; //ajout de constraint?.index

            // "Event_userId_fkey" → "userId"
            const field = rawConstraint
                .replace(/_fkey$/, "")
                .split("_")
                .slice(1)
                .join("_");

            return {
                statusCode: 400,
                message: `${field || "related resource"} does not exist`,
            };
        }
        default:
            console.error(`[Prisma P${error.code}]`, error.message, error.meta);
            return {
                statusCode: 500,
                message: "Database error",
            };
    }
}

// ─── Global Error Handler ─────────────────────────────────────────────────────

export function globalErrorHandler(
    error: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const isDev = process.env.NODE_ENV === "development";

    // 1. Erreurs métier
    if (error instanceof AppError) {
        const body: ErrorResponse = {
            status: "error",
            statusCode: error.statusCode,
            message: error.message,
        };

        if (error instanceof ValidationError) {
            body.details = error.errors;
        }

        res.status(error.statusCode).json(body);
        return;
    }

    // 2. Zod
    if (error instanceof ZodError) {
        const details = error.issues.reduce<Record<string, string[]>>((acc, issue) => {
            const key = issue.path.join(".") || "root";
            acc[key] = [...(acc[key] ?? []), issue.message];
            return acc;
        }, {});

        res.status(422).json({
            status: "error",
            statusCode: 422,
            message: "Validation failed",
            details,
        });
        return;
    }

    // 3. Prisma known errors
    if (error instanceof PrismaClientKnownRequestError) {
        const { statusCode, message } = handlePrismaError(error);
        res.status(statusCode).json({ status: "error", statusCode, message });
        return;
    }

    // 4. Prisma validation
    if (error instanceof PrismaClientValidationError) {
        console.error("[Prisma Validation]", error.message);
        res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Invalid data sent to database",
        });
        return;
    }

    // 5. Prisma init
    if (error instanceof PrismaClientInitializationError) {
        console.error("[Prisma Init]", error.message);
        res.status(503).json({
            status: "error",
            statusCode: 503,
            message: "Database unavailable",
        });
        return;
    }

    // 6. JWT errors corrigé
    if (error instanceof jwt.JsonWebTokenError) {
        const message =
            error instanceof jwt.TokenExpiredError
                ? "Token expired"
                : error instanceof jwt.NotBeforeError
                    ? "Token not yet active"
                    : "Invalid token";

        res.status(401).json({
            status: "error",
            statusCode: 401,
            message,
        });
        return;
    }

    // 7. JSON malformé
    if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Malformed JSON",
        });
        return;
    }

    // 8. fallback
    console.error("[Unhandled]", {
        message: (error as Error)?.message,
        stack: (error as Error)?.stack,
        route: `${req.method} ${req.path}`,
    });

    res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "Internal server error",
        ...(isDev && { stack: (error as Error)?.stack }),
    });
}