// errors/httpErrors.ts
import AppError from "./AppError.js";

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(400, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(403, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(404, message);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(409, message);
    }
}

export class ValidationError extends AppError {
    public readonly errors: Record<string, string[]>;

    constructor(errors: Record<string, string[]>, message = "Validation failed") {
        super(422, message);
        this.errors = errors;
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(500, message, false);
    }
}