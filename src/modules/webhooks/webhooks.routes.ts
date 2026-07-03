// routes/webhooks.routes.ts
import express from "express";
import { geniusPayWebhookHandler } from "../../controllers/webhooks/geniuspay.webhook.js";

const router = express.Router();

// express.raw() ICI seulement, pas globalement — pour la vérification de signature
router.post(
    "/webhooks/geniuspay",
    express.raw({ type: "application/json" }),(req, res, next) => {
        console.log("🔔 Webhook GeniusPay reçu à", new Date().toISOString());
        next();
    },
    geniusPayWebhookHandler
);

export default router;