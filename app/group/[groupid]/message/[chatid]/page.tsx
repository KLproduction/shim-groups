import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { onGetAllUserMessages, onGetUserFromMembership } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import { AvatarImage } from "@radix-ui/react-avatar"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { User } from "lucide-react"
import React from "react"

type Props = {
  params: {
    chatid: string
  }
}

const MemberChatPage = async ({ params }: Props) => {
  const query = new QueryClient()
  const member = await onGetUserFromMembership(params.chatid)

  await query.prefetchQuery({
    queryKey: ["user-message", params.chatid],
    queryFn: () => onGetAllUserMessages(params.chatid),
  })

  const user = await onAuthenticatedUser()

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className=" h-full flex flex-col p-5">
        <div className=" bg-themeBlack rounded-2xl p-5">
          <div className=" flex gap-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src={member.user?.User?.image!} alt="user" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <h3 className=" font-semibold text-2xl capitalize">
              {member.user?.User?.name}
            </h3>
          </div>
        </div>
        {/* <ChatWindow/>
        <MessageForm/> */}
      </div>
    </HydrationBoundary>
  )
}

export default MemberChatPage
