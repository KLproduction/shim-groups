import { onSignUpUser } from "@/actions/auth"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import React from "react"

type Props = {}

const CompleteOAuthCallback = async (props: Props) => {
    const user = await currentUser()
    if (!user) redirect("/sign-in")
    const complete = await onSignUpUser({
        firstname: user.firstName as string,
        lastname: user.lastName as string,
        image: user.imageUrl,
        clerkId: user.id,
    })

    if (complete.status === 200) {
        redirect("/group/create")
    }

    if (complete.status !== 200) {
        redirect("/sign-in")
    }
}

export default CompleteOAuthCallback
