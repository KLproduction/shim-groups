import { onGetChannelInfo } from "@/data/channels"
import { onGetGroupInfo } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { QueryClient } from "@tanstack/react-query"
import React from "react"

type Props = {
    params: {
        channelid: string
        groupid: string
    }
}

const GroupChannelPage = async ({ params }: Props) => {
    const query = new QueryClient()
    const user = await currentUser()
    const authUser = await onAuthenticatedUser()

    await query.prefetchQuery({
        queryKey: ["channel-info"],
        queryFn: () => {
            return onGetChannelInfo(params.channelid)
        },
    })
    await query.prefetchQuery({
        queryKey: ["group-info"],
        queryFn: () => {
            return onGetGroupInfo(params.groupid)
        },
    })

    return <div>GroupChannelPage</div>
}

export default GroupChannelPage
