"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGroupChat } from "@/hooks/groups"
import { useAppSelector } from "@/redux/store"
import { Members } from "@prisma/client"
import { User } from "lucide-react"
import Link from "next/link"
import React from "react"

type Props = {
  groupId: string
}

const GroupChatMenu = ({ groupId }: Props) => {
  const { members } = useAppSelector((state) => state.onlineTracking)
  const { data, pathname } = useGroupChat(groupId)
  return (
    <div className=" flex flex-col">
      {data?.status === 200 &&
        data?.members?.map((member) => (
          <Link
            href={`${pathname}/${member.id}`}
            key={member.id}
            className="flex gap-2 items-center p-5 hover:bg-themeGray"
          >
            <div className="relative">
              {members.map(
                (m) =>
                  m.id === member.userId && (
                    <span
                      key={m.id}
                      className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full z-50"
                    ></span>
                  ),
              )}
              <Avatar>
                <AvatarImage src={member.User?.image!} alt="user" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className=" flex flex-col">
              <h3>{member.User?.name}</h3>
              <p className="text-sm text-themeTextGray">No active chat found</p>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default GroupChatMenu
