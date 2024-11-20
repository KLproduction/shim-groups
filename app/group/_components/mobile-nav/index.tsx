import Notifications from "@/components/global/user-widget/notification"
import UserAvatar from "@/components/global/user-widget/user"
import { onAuthenticatedUser } from "@/data/user"
import { Message } from "@/icons"
import { Home } from "@/icons"

import Link from "next/link"
import React from "react"

type Props = {
  groupId: string
  userId: string
}

const MobileNav = async ({ groupId, userId }: Props) => {
  const user = await onAuthenticatedUser()

  return (
    <div className=" bg-zinc-700 w-screen py-3 flex px-11 fixed bottom-0 z-50 md:hidden justify-between items-center h-12">
      <Link href={`/explore/`}>
        <Home className="h-7 w-7" />
      </Link>
      <Notifications />
      <Link href={`/group/${groupId}/message`}>
        <Message className="h-7 w-7" />
      </Link>
      <UserAvatar
        image={user.image!}
        groupId={groupId}
        userId={userId}
        userName={user.username!}
      />
    </div>
  )
}

export default MobileNav
