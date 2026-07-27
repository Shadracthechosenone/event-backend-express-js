import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // 5 tentatives max par IP dans la fenêtre
    message: {
        status: "fail",
        message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
    },
    standardHeaders: true, // renvoie les headers RateLimit-*
    legacyHeaders: false,
    skipSuccessfulRequests: true, // ne compte que les tentatives échouées
}); 