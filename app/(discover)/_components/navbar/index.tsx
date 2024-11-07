import GlassSheet from "@/components/global/form-generator/glass-sheet"
import UserWidget from "@/components/global/user-widget"
import { Button } from "@/components/ui/button"
import { onGetUserGroups } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import { CheckBadge, Logout } from "@/icons"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { GroupDropDown } from "./group-dropdown"

export const Navbar = async () => {
  const user = await onAuthenticatedUser()

  if (!user) return
  const groups = await onGetUserGroups(user.id!)

  return (
    <div className="flex px-5 py-3 items-center bg-themeBlack border-b-[1px] border-themeDarkGray fixed z-50 w-full bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60">
      <div className="hidden lg:inline">
        {user.status === 200 ? (
          <GroupDropDown members={groups.members} groups={groups} />
        ) : (
          <p>Shim-Groups</p>
        )}
      </div>
      <GlassSheet
        trigger={
          <span className="lg:hidden flex items-center gap-2 py-2">
            <MenuIcon className="cursor-pointer" />
            <p>Shim-Groups</p>
          </span>
        }
      >
        <div>Content</div>
      </GlassSheet>
      <div className="flex-1 lg:flex hidden justify-end gap-3">
        <Link href={user.status === 200 ? `/group/create` : "/sign-in"}>
          <Button
            variant="outline"
            className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
          >
            <CheckBadge />
            Create Group
          </Button>
        </Link>
        {user.status === 200 ? (
          <UserWidget
            image={user.image!}
            userId={user.id!}
            userName={user.username!}
          />
        ) : (
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
            >
              <Logout />
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}