import GlassSheet from "@/components/global/form-generator/glass-sheet"
import { MenuIcon } from "lucide-react"
import React from "react"
import GroupChatMenu from "./_components/chat-menu/indext"

type Props = {
  children: React.ReactNode
  params: {
    groupid: string
  }
}

const MessageLayout = async ({ children, params }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 flex-1 h-0">
      <div className="lg:col-span-4 flex flex-col">
        <div className=" flex justify-between items-center p-5 lg:hidden">
          <p className="font-medium text-themeTextWhite">No Chat selected</p>
          <GlassSheet trigger={<MenuIcon />}>
            <GroupChatMenu groupId={params.groupid} />
          </GlassSheet>
        </div>
        {children}
      </div>
      <div className=" hidden lg:inline lg:col-span-2 bg-themeBlack rounded-tl-3xl">
        <GroupChatMenu groupId={params.groupid} />
      </div>
    </div>
  )
}

export default MessageLayout
