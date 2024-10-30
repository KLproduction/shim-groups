import { onSignInUser } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

type Props = {}

const CompleteSignIn = async (props: Props) => {
    const user = await currentUser()
    if (!user) redirect("/sign-in")

    const authenticated = await onSignInUser(user.id!)

    if (authenticated.status === 200) {
        redirect("/group/create")
    }

    if (authenticated.status === 207) {
        redirect(
            `/group/${authenticated.groupId}/channel/${authenticated.channelId}`,
        )
    }

    if (authenticated.status !== 200) {
        redirect("/")
    }
}

export default CompleteSignIn
