import { LeaderBoardCard } from "@/app/group/_components/mobile-nav/leader-board"
import { onGetChannelInfo } from "@/data/channels"
import { onGetGroupInfo } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import { currentUser } from "@/lib/auth"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
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

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="grid lg:grid-cols-4 grid-cols-1 w-full flex-1 h-0 gap-x-5 px-5">
        <div className=" col-span-1 lg:inline relative hidden py-5">
          <LeaderBoardCard light />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default GroupChannelPage
