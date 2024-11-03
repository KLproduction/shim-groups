import React from "react"
import GlassSheet from "../form-generator/glass-sheet"
import { Bell } from "@/icons"

type Props = {}

const Notifications = (props: Props) => {
  return (
    <GlassSheet
      trigger={
        <span className="cursor-pointer">
          <Bell />
        </span>
      }
    >
      <div>test</div>
    </GlassSheet>
  )
}

export default Notifications
