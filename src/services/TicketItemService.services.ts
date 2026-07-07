
import QRCode from "qrcode";
import sendEmail from "../utils/sendEmail.js"; // ton chemin actuel
import { TicketItemStatus } from "@prisma/client";


type TicketItem = {
    id: string;
    status:TicketItemStatus;
    ticketId: string;
    holderName: string | null;
    holderEmail: string;

}

const generateQrForTicketItem = async (ticketItemId: string): Promise<Buffer> => {
    const qrPayload = JSON.stringify({ ticketItemId });
    return await QRCode.toBuffer(qrPayload, {
        type: "png",
        width: 300,
        margin: 2,
    });
};

const sendSingleTicketEmail = async (item: TicketItem): Promise<void> => {
    const qrBuffer = await generateQrForTicketItem(item.id);

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





export const TicketItemService = {

    sendTicketEmails
}