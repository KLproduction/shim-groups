import StripeElements from "@/components/global/stripe/elements"
import React from "react"
import PaymentForm from "./payment"

type Props = {
    userId: string
    affiliate: boolean
    stripeId?: string
}

const CreateGroup = ({ userId, affiliate, stripeId }: Props) => {
    return (
        <StripeElements>
            <PaymentForm
                userId={userId}
                affiliate={affiliate}
                stripeId={stripeId}
            />
        </StripeElements>
    )
}

export default CreateGroup
