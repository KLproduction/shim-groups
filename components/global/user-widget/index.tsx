"use client"

import { Message } from "@/icons"
import Link from "next/link"
import React from "react"
import Notifications from "./notification"
import UserAvatar from "./user"

type Props = {
  image: string
  groupId?: string
  userId: string
  userName: string
}

const UserWidget = ({ image, groupId, userId, userName }: Props) => {
  return (
    <div className=" gap-5 items-center hidden md:flex">
      <Notifications />
      <Link href={`/group/${groupId}/message`}>
        <Message />
      </Link>
      <UserAvatar
        userId={userId}
        groupId={groupId}
        image={image}
        userName={userName}
      />
    </div>
  )
}

export default UserWidget
