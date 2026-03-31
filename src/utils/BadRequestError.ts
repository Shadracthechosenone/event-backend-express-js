import AppError from "./Apperror.js";

class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: AppError["details"]) {
    super(400, message, true, details);
  }
}

export default BadRequestError;