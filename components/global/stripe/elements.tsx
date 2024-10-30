"use client"
import { useStripeElements } from "@/hooks/payment"
import {
    AddressElement,
    Elements,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js"
type Props = {
    children: React.ReactNode
}

const StripeElements = ({ children }: Props) => {
    const { StripePromise } = useStripeElements()

    const promise = StripePromise()

    return promise && <Elements stripe={promise}>{children}</Elements>
}

export default StripeElements
