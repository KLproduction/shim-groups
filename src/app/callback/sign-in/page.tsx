import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

type Props = {}

const CompleteSignIn = async (props: Props) => {
    const user = await currentUser()
    if (!user) redirect("/sign-in")

    const authenticated = await OnSignInUser(user.id)

    if (authenticated.status === 200) {
        redirect("/group/create")
    }

    if (authenticated.status === 207) {
        redirect(
            `/group/${authenticated.groupId}/channel/${authenticated.channelId}`,
        )
    }

    if (authenticated.status !== 200) {
        redirect("/sign-in")
    }
}

export default CompleteSignIn
