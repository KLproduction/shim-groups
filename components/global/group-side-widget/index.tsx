"use client"

import JoinButton from "@/app/(discover)/about/[groupid]/_components/join-button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGroupInfo } from "@/hooks/groups"
import { cn, truncateString } from "@/lib/utils"
import React from "react"

type Props = {
  light?: boolean
  groupId: string
  userId: string
}

const GroupSideWidget = ({ light, groupId, userId }: Props) => {
  const group = useGroupInfo(groupId)
  return (
    <Card
      className={cn(
        "border-themeGray lg:sticky lg:top-20 mt-20 lg:mt-0 rounded-xl overflow-hidden",
        light ? "bg-zinc-800" : "bg-themeBlack",
      )}
    >
      <img
        src={`https://ucarecdn.com/${group?.thumbnail}/`}
        alt="thumbnail"
        className="w-full aspect-video mt-5 object-cover object-center"
      />

      <div className="flex flex-col p-5 gap-2">
        <h2 className="font-bold text-lg">{group?.name}</h2>
        <p className="text-sm text-themeTextGray">
          {group.description && truncateString(group.description)}
        </p>
      </div>
      <Separator orientation="horizontal" className="bg-themeGray" />
      {groupId && (
        <JoinButton groupId={groupId} owner={group?.userId === userId} />
      )}
    </Card>
  )
}

export default GroupSideWidget
