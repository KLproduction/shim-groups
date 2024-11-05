"use client"

import { signOutAction } from "@/actions/signOut"
import { supabaseClient } from "@/lib/utils"
import { onOffline } from "@/redux/slices/online-member-slice"
import { AppDispatch } from "@/redux/store"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import DropDown from "../drop-down"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logout, Settings } from "@/icons"
import { redirect } from "next/navigation"

type Props = {
  image: string
  groupId: string
  userId: string
  userName: string
}

const UserAvatar = ({ image, groupId, userId, userName }: Props) => {
  const untrackPresence = async () => {
    await supabaseClient.channel("tracking").unsubscribe()
  }

  const dispatch: AppDispatch = useDispatch()
  const signOut = async () => await signOutAction()
  const onLogout = async () => {
    untrackPresence()
    dispatch(onOffline({ members: [{ id: userId, userName: userName }] }))
    await signOut()
  }

  return (
    <DropDown
      title="Account"
      trigger={
        <Avatar className="cursor-pointer flex gap-5">
          <AvatarImage src={image} alt={"user"} />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
      }
    >
      <Link href={`/group/${groupId}/settings`} className="flex gap-3 p-2">
        <Settings />
        Settings
      </Link>
      <div
        onClick={onLogout}
        className="flex gap-4 p-2 justify-start w-full border-0 cursor-pointer items-center"
      >
        <Logout />
        Sign Out
      </div>
    </DropDown>
  )
}

export default UserAvatar
