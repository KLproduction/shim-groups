"use server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
    typescript: true,
})
export const onGetStripeClientSecret = async () => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "gbp",
            amount: 9900,
            automatic_payment_methods: {
                enabled: true,
            },
        })
        if (paymentIntent) {
            return { secret: paymentIntent.client_secret }
        }
    } catch (error) {
        return { status: 400, message: "Failed to load form" }
    }
}

export const onTransferCommission = async (destination: string) => {
    try {
        const transfer = await stripe.transfers.create({
            amount: 3960,
            currency: "gbp",
            destination: destination,
        })

        if (transfer) {
            return { status: 200 }
        }
    } catch (error) {
        return { status: 400 }
    }
}
