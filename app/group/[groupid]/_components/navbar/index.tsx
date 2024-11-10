import GlassSheet from "@/components/global/form-generator/glass-sheet"
import Search from "@/components/global/search"
import SideBar from "@/components/global/sidebar"
import UserWidget from "@/components/global/user-widget"
import { Button } from "@/components/ui/button"
import OnlineUsersList from "@/hooks/groups/online"
import { CheckBadge } from "@/icons"
import { currentUser } from "@/lib/auth"
import { Menu } from "lucide-react"
import Link from "next/link"
import React from "react"

type Props = {
  groupId: string
  userId: string
}

export const Navbar = async ({ groupId, userId }: Props) => {
  const user = await currentUser()
  return (
    <div className=" bg-zinc-700 py-2 px-3 md:px-7 md:py-5 flex gap-5 justify-between md:justify-end items-center">
      <GlassSheet trigger={<Menu className="md:hidden cursor-pointer" />}>
        <SideBar groupId={groupId} userId={userId} mobile={true} />
      </GlassSheet>

      <Link
        href={`/explore`}
        className="rounded-3xl bg-themeBlack text-white px-3 py-2"
      >
        Explore
      </Link>

      <Search
        searchType="POSTS"
        className="rounded-full border-themeGray bg-black !opacity-100 px-3"
        placeholder="Search for posts..."
      />
      <Link href={`/group/create`} className="hidden md:inline">
        <Button
          variant={"outline"}
          className=" bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeTextGray"
        >
          <CheckBadge />
          Create Group
        </Button>
      </Link>
      <UserWidget
        userId={userId}
        image={user?.image!}
        groupId={groupId}
        userName={user?.name as string}
      />
    </div>
  )
}
