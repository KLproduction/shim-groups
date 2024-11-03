"use client"

import { useGroupChatOnline } from "@/hooks/groups"
import { useSideBar } from "@/hooks/navigation"
import { cn } from "@/lib/utils"
import React from "react"
import DropDown from "../drop-down"
import { CarotSort } from "@/icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Group, Plus } from "lucide-react"
import { v4 } from "uuid"
import SideBarMenu from "./menu"

type Props = {
  groupId: string
  userId: string
  mobile?: boolean
}
export interface IGroupInfo {
  status: number
  group:
    | {
        id: string
        name: string
        category: string
        thumbnail: string | null
        description: string | null
        gallery: string[]
        jsonDescription: string | null
        htmlDescription: string | null
        privacy: boolean
        active: boolean
        createdAt: Date
        userId: string
        icon: string
      }
    | undefined
}

export interface IChannels {
  id: string
  name: string
  icon: string
  createdAt: Date
  groupId: string | null
}

export interface IGroups {
  status: number
  groups:
    | {
        icon: string | null
        id: string
        name: string
      }[]
    | undefined
}

const SideBar = ({ groupId, userId, mobile }: Props) => {
  const { groupInfo, groups, mutate, variables, isPending, channels } =
    useSideBar(groupId)

  useGroupChatOnline(userId)

  if (!groups || !groups.groups) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        No groups found
      </div>
    )
  }

  return (
    <div
      className={cn(
        "h-screen flex flex-col gap-10 sm:px-5",
        !mobile ? "hidden bg-black md:w-[300px] fixed md:flex" : "w-full flex",
      )}
    >
      {groups.groups && groups.groups.length > 0 && (
        <DropDown
          title="Groups"
          trigger={
            <div
              className="w-full flex items-center justify-center text-themeTextGray
                    md:border-[1px] border-themeGray p-3 rounded-xl cursor-pointer"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={`https://ucarecdn.com/${groupInfo?.group?.icon as string}/`}
                  alt="icon"
                  className="w-10 rounded-lg"
                />
                <p className="text-sm">{groupInfo.group?.name}</p>
              </div>
              <span>
                <CarotSort />
              </span>
            </div>
          }
        >
          {groups &&
            groups.groups.length > 0 &&
            groups.groups.map(
              (item) =>
                channels &&
                channels.channels && (
                  <Link
                    href={`/group/${item.id}/channel/${channels?.channels[0].id!}`}
                    key={item.id}
                  >
                    <Button
                      variant={"ghost"}
                      className="flex gap-3 w-full justify-start hover:bg-themeGray items-center"
                    >
                      <Group />
                      {item.name}
                    </Button>
                  </Link>
                ),
            )}
        </DropDown>
      )}
      <div className="flex flex-col gap-y-5">
        <div className="flex justify-between items-center">
          <p className="text-xd text-[#F7ECE9]">CHANNELS</p>
          {userId === groupInfo?.group?.userId && (
            <Plus
              className={cn(
                "text-themeTextGray cursor-pointer hover:text-zinc-50",
                isPending && "opacity-70",
              )}
              size={16}
              {...(!isPending && {
                onClick: () =>
                  mutate({
                    id: v4(),
                    icon: "general",
                    name: "New Channel",
                    createdAt: new Date(),
                    groupId: groupId,
                  }),
              })}
            />
          )}
        </div>
        <SideBarMenu
          channels={channels?.channels!}
          optimisticChannel={variables}
          loading={isPending}
          groupid={groupId}
          groupUserId={userId}
          userId={userId}
        />
      </div>
    </div>
  )
}

export default SideBar
