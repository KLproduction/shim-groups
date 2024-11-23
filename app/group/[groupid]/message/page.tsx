import { Empty } from "@/icons"
import React from "react"

type Props = {}

const MessagePage = async (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center flex-1 gap-3 min-h-screen">
      <Empty />
      <p className="text-themeTextGray">No chat selected</p>
    </div>
  )
}

export default MessagePage
