// services/geniuspay.service.ts
import axios from "axios";
import { updatePaymentStatus } from "@/src/repositories/payment.repository.js";

const GENIUSPAY_BASE_URL = "https://pay.genius.ci/api/v1/merchant/payments";
const GENIUSPAY_API_KEY = process.env.GENIUSPAY_API_KEY as string;
const GENIUSPAY_API_SECRET = process.env.GENIUSPAY_API_SECRET as string;

const geniusPayHeaders = {
    "X-API-Key": GENIUSPAY_API_KEY,
    "X-API-Secret": GENIUSPAY_API_SECRET,
    "Content-Type": "application/json",
};

// Mode checkout : on omet payment_method, le client choisit
// Wave/Orange/MTN/Moov/carte sur la page hébergée GeniusPay
const initiateGeniusPayPayment = async (data: {
    paymentId: string; // ton Payment.id interne (Prisma)
    amount: number;
    description: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}) => {
    try{

        const response = await axios.post(GENIUSPAY_BASE_URL, {
            amount: data.amount,
        currency: "XOF",
        description: data.description,
        customer: {
            name: data.customerName,
            email: data.customerEmail,
            phone: data.customerPhone,
        },
        success_url: `${process.env.FRONTEND_URL}`,
        error_url: `${process.env.FRONTEND_URL}`,
        // on stocke notre id interne dans metadata pour le retrouver au webhook
        metadata: {
            payment_id: data.paymentId,
        },
    }, { headers: geniusPayHeaders });
    
    const { reference, checkout_url } = response.data.data;
    
    // on enregistre la reference GeniusPay (MTX-...) comme transactionRef
    await updatePaymentStatus(data.paymentId, {
        status: "PENDING",
        transactionRef: reference,
    });
    
    return { checkoutUrl: checkout_url, reference };
}catch (error) {
        if (axios.isAxiosError(error)) {
            // C'est CETTE ligne qui va te donner la vraie raison
            console.error("GeniusPay 422 details:", JSON.stringify(error.response?.data, null, 2));
        }
        throw error;


}
};

export { initiateGeniusPayPayment };