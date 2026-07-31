// controllers/report.controller.ts
import { Request, Response, NextFunction } from "express";
import PDFDocument from "pdfkit";
import AppError from "../utils/AppError.js";
import { TicketItemService } from "../services/TicketItemService.services.js";
import { db } from "../utils/db.js";


const STATUS_LABELS: Record<string, string> = {
    REGISTERED: "Inscrit",
    CONFIRMED: "Confirmé",
    CANCELLED: "Annulé",
    PRESENT: "Présent",
};

export const exportAllParticipantsPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const participants = await db.eventParticipant.findMany({
            select: {
                status: true,
                checkedIn: true,
                checkedInAt: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                event: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: [
                { event: { name: "asc" } },
                { createdAt: "asc" },
            ],
        });

        if (!participants || participants.length === 0) {
            return next(new AppError(404, "Aucun participant trouvé."));
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=participants-${new Date().toISOString().slice(0, 10)}.pdf`
        );

        const doc = new PDFDocument({ margin: 40, size: "A4" });
        doc.pipe(res);

        // ---- En-tête ----
        doc.fontSize(18).text("Liste des participants", { align: "center" });
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor("#666").text(
            `Généré le ${new Date().toLocaleDateString("fr-FR")} — ${participants.length} participant(s)`,
            { align: "center" }
        );
        doc.moveDown(1.5);
        doc.fillColor("#000");

        // ---- En-tête tableau ----
        const startX = 40;
        const drawTableHeader = () => {
            const y = doc.y;
            doc.fontSize(10).font("Helvetica-Bold");
            doc.text("Événement", startX, y, { width: 130 });
            doc.text("Utilisateur", startX + 130, y, { width: 110 });
            doc.text("Email", startX + 240, y, { width: 140 });
            doc.text("Statut", startX + 380, y, { width: 70 });
            doc.text("Check-in", startX + 450, y, { width: 65 });
            doc.moveDown(0.5);
            doc.moveTo(startX, doc.y).lineTo(555, doc.y).strokeColor("#ccc").stroke();
            doc.moveDown(0.3);
        };

        drawTableHeader();

        // ---- Lignes ----
        doc.font("Helvetica").fontSize(9);
        participants.forEach((p) => {
            if (doc.y > 740) {
                doc.addPage();
                drawTableHeader();
                doc.font("Helvetica").fontSize(9);
            }
            const rowY = doc.y;
            doc.text(p.event?.name ?? "-", startX, rowY, { width: 130 });
            doc.text(p.user?.name ?? "-", startX + 130, rowY, { width: 110 });
            doc.text(p.user?.email ?? "-", startX + 240, rowY, { width: 140 });
            doc.text(STATUS_LABELS[p.status] ?? p.status, startX + 380, rowY, { width: 70 });
            doc.text(p.checkedIn ? "Présent" : "En attente", startX + 450, rowY, { width: 65 });
            doc.moveDown(0.6);
        });

        doc.end();
    } catch (error) {
        next(error);
    }
};

export const reportController = {
    exportAllParticipantsPdf

}