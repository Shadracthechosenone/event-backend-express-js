
import QRCode from "qrcode";
import sendEmail from "../utils/sendEmail.js"; // ton chemin actuel
import { TicketItemStatus } from "@prisma/client";
import AppError from "../utils/AppError.js";
import { db } from "../utils/db.js";
import { TicketItemRepository } from "../repositories/TicketItemRepository.repository.js";
import { eventsRepository } from "../repositories/events.repository.js";



type TicketItem = {
    id: string;
    status: TicketItemStatus;
    ticketId: string;
    holderName: string | null;
    holderEmail: string;
    qrCode: string

}

const generateQrForTicketItem = async (ticketItemId: string, evendId?: string): Promise<Buffer> => {
    const qrPayload = JSON.stringify({ ticketItemId, evendId });
    return await QRCode.toBuffer(qrPayload, {
        type: "png",
        width: 300,
        margin: 2,
    });
};

const sendSingleTicketEmail = async (item: TicketItem): Promise<void> => {

    const event = await eventsRepository.findEventByTicketId(item.ticketId)
    if (!event) {
        throw new AppError(404, "Event non trouve");

    }
    const qrBuffer = await generateQrForTicketItem(item.qrCode, event.eventId);

    const success = await sendEmail({
        to: item.holderEmail,
        subject: "Votre billet",
        text: `Bonjour ${item.holderName ?? ""}, voici votre billet.`,
        html: `
            <p>Bonjour ${item.holderName ?? ""},</p>
            <p>Voici votre billet. Présentez ce QR code à l'entrée de l'événement.</p>
            <img src="cid:ticket-qr" alt="QR code billet" />
        `,
        attachments: [
            {
                filename: `ticket-${item.id}.png`,
                content: qrBuffer,
                cid: "ticket-qr",
            },
        ],
    });

    if (!success) {
        throw new Error(`Échec envoi email pour ticketItem ${item.id}`);
    }
};

const sendTicketEmails = async (ticketItems: TicketItem[]): Promise<void> => {
    const results = await Promise.allSettled(
        ticketItems.map(item => sendSingleTicketEmail(item))
    );

    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(
                `Échec envoi email pour ticketItem ${ticketItems[index].id}:`,
                result.reason
            );
        }
    });
};

export { sendTicketEmails, generateQrForTicketItem };



export const verifyTicketQrCode = async (qrCode: string, expectedEventId?: string) => {
    const ticketItem = await TicketItemRepository.findTicketItemByQrCode(qrCode);
    console.log("test qrcode", qrCode)

    if (!ticketItem) {
        throw new AppError(404, "QR code invalide : aucun billet trouvé.");
    }

    const { ticket } = ticketItem;

    if (expectedEventId && ticket.eventId !== expectedEventId) {
        throw new AppError(400, "Ce billet n'appartient pas à cet événement.");
    }

    if (ticket.status !== "CONFIRMED") {
        throw new AppError(400, "Le paiement de ce billet n'est pas confirmé.");
    }

    if (ticketItem.status === "CANCELLED") {
        throw new AppError(400, "Ce billet a été annulé.");
    }

    if (ticketItem.status === "USED") {
        throw new AppError(409,
            `Ce billet a déjà été scanné le ${ticketItem.usedAt?.toLocaleString("fr-FR")}.`,

        );
    }

    // Transaction : marquer le billet utilisé + check-in du participant en une seule fois
    const result = await db.$transaction(async (tx) => {
        const updatedItem = await tx.ticketItem.update({
            where: { id: ticketItem.id },
            data: { status: "USED", usedAt: new Date() },
            select: { id: true, status: true, usedAt: true, holderName: true, holderEmail: true },
        });

        const participant = await tx.eventParticipant.findUnique({
            where: { eventId_userId: { eventId: ticket.eventId, userId: ticket.userId } },
            select: { id: true, checkedIn: true },
        });

        let updatedParticipant = null;
        if (participant && !participant.checkedIn) {
            updatedParticipant = await tx.eventParticipant.update({
                where: { id: participant.id },
                data: { checkedIn: true, checkedInAt: new Date(), status: "PRESENT" },
                select: { id: true, checkedIn: true, checkedInAt: true },
            });
        }

        return { updatedItem, updatedParticipant };
    });

    return {
        ticketItem: result.updatedItem,
        event: ticket.eventId,
        participantCheckedIn: !!result.updatedParticipant,
    };
}

const findAllByEvent = async (eventId: string) => {
    return db.ticketItem.findMany({
        where: {
            ticket: {
                eventId: eventId,
            },
        },
        select: {
            holderName: true,
            holderEmail: true,
            status: true,
            usedAt: true,
            createdAt: true,
            ticket: {
                select: {
                    price: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

    export const TicketItemService = {

        sendTicketEmails,
        verifyTicketQrCode,
        findAllByEvent
        
    }