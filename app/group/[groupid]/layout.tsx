import SideBar from "@/components/global/sidebar"
import {
  onGetAllGroupMembers,
  onGetGroupChannels,
  onGetGroupInfo,
  onGetGroupSubscriptions,
  onGetUserGroups,
} from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { redirect } from "next/navigation"
import React from "react"
import { Navbar } from "./_components/navbar"

type Props = {
  children: React.ReactNode
  params: {
    groupid: string
  }
}

const GroupLayout = async ({ children, params }: Props) => {
  const query = new QueryClient()

  const user = await onAuthenticatedUser()

  if (!user.id) redirect("/sign-in")

  await query.prefetchQuery({
    queryKey: ["group-info"],
    queryFn: () => {
      return onGetGroupInfo(params.groupid)
    },
  })

  await query.prefetchQuery({
    queryKey: ["user-groups"],
    queryFn: () => {
      return onGetUserGroups(user.id as string)
    },
  })

  await query.prefetchQuery({
    queryKey: ["group-channels"],
    queryFn: () => {
      return onGetGroupChannels(params.groupid)
    },
  })
  await query.prefetchQuery({
    queryKey: ["group-subscriptions"],
    queryFn: () => {
      return onGetGroupSubscriptions(params.groupid)
    },
  })
  await query.prefetchQuery({
    queryKey: ["member-chats"],
    queryFn: () => {
      return onGetAllGroupMembers(params.groupid)
    },
  })
  const userGroupsData = query.getQueryData(["group-channels"])

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen md:pt-5">
        <SideBar groupId={params.groupid} userId={user.id} />
        <div className="md:ml-[300px] flex flex-col flex-1 bg-[#101011] md:rounded-tl-xl overflow-y-auto border-l-[1px] border-t-[1px] border-zinc-800">
          <Navbar groupId={params.groupid} userId={user.id} />
          {children}
          {/* <MobileNav groupId={params.groupid} userId={user.id} /> */}
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default GroupLayout
