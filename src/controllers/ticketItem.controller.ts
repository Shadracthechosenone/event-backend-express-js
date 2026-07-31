import { Request, Response, NextFunction } from "express";
import AppError from '../utils/AppError.js';
import { TicketItemService } from "../services/TicketItemService.services.js";

export const verifyTicketQrCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { qrCode, eventId } = req.body;
        if (!qrCode) {
            return next(new AppError(400, "Le champ qrCode est requis."));
        }
        let parsedQrCode: { ticketItemId?: string; eventId?: string | number };
        try {
            parsedQrCode = JSON.parse(qrCode);
        } catch (parseError) {
            return next(new AppError(400, "Billet invalide."));
        }

        // Le JSON est valide, mais ce n'est peut-être pas le format d'un billet
        // (ex: un autre type de QR, un objet vide, un tableau, etc.)
        if (
            typeof parsedQrCode !== "object" ||
            parsedQrCode === null ||
            !parsedQrCode.ticketItemId
        ) {
            return next(new AppError(400, "Billet invalide."));
        }

        const newCode = parsedQrCode.ticketItemId;
        const IdEvent = parsedQrCode.eventId ?? eventId;
        console.log("newcode", newCode);

        const result = await TicketItemService.verifyTicketQrCode(newCode, IdEvent);

        res.status(200).json({
            status: "success",
            message: "Billet validé avec succès.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};