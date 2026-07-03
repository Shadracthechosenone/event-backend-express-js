// controllers/webhooks/geniuspay.webhook.ts
import crypto from "crypto";
import { EventParticipantService } from "../../services/eventParticipant.services.js";
import { AppError } from "@/src/utils/AppError.js";
import catchAsync from "@/src/utils/catchAsync.js";

const GENIUSPAY_WEBHOOK_SECRET = process.env.GENIUSPAY_WEBHOOK_SECRET as string;

// Mappe les statuts GeniusPay vers ton enum PaymentStatus
const mapGeniusPayStatus = (status: string): "SUCCESS" | "FAILED" => {
    if (status === "completed") return "SUCCESS";
    // failed, cancelled, expired -> tous traités comme FAILED côté métier
    return "FAILED";
};

const geniusPayWebhookHandler = catchAsync(async (req, res) => {
    const signature = req.headers["x-webhook-signature"] as string;
    const timestamp = req.headers["x-webhook-timestamp"] as string;

    if (!signature || !timestamp) {
        throw new AppError(401, "Missing webhook signature headers");
    }

    // Vérification de la signature : HMAC-SHA256(timestamp + "." + payload, secret)
    const rawPayload = req.body.toString("utf8");
    const dataToSign = `${timestamp}.${rawPayload}`;
    const expectedSignature = crypto
        .createHmac("sha256", GENIUSPAY_WEBHOOK_SECRET)
        .update(dataToSign)
        .digest("hex");

    const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
    if (!isValid) {
        throw new AppError(401, "Invalid webhook signature");
    }

    // Protection replay attack (webhook vieux de plus de 5 min = rejeté)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp, 10)) > 300) {
        throw new AppError(400, "Webhook timestamp too old");
    }

    const parsedBody = JSON.parse(rawPayload);
    const { event, data } = parsedBody;

    if (event === "payment.success" || event === "payment.failed") {
        await EventParticipantService.confirmPayment({
            transactionRef: data.reference, // MTX-...
            status: mapGeniusPayStatus(data.status),
            failureReason: event === "payment.failed" ? data.status : undefined,
        });
    }

    res.status(200).json({ received: true });
});

export { geniusPayWebhookHandler };