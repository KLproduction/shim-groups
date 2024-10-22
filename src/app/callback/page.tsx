import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import React from "react"

type Props = {}

const CallBackPage = (props: Props) => {
    return <AuthenticateWithRedirectCallback />
}

export default CallBackPage
