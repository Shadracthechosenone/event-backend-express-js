import { Request, Response, NextFunction } from "express";
import AppError from '../utils/AppError.js';
import {TicketItemService} from "../services/TicketItemService.services.js";

export const verifyTicketQrCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { qrCode, eventId } = req.body;

        if (!qrCode) {
            return next(new AppError(400,"Le champ qrCode est requis."));
        }

        const parsedQrCode = JSON.parse(qrCode);
        const newCode = parsedQrCode.ticketItemId;
        console.log("newcode",newCode)

        const result = await TicketItemService.verifyTicketQrCode(newCode, eventId);

        res.status(200).json({
            status: "success",
            message: "Billet validé avec succès.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};