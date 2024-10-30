import React from "react"
import DropDown from "../drop-down"
import { cn } from "@/lib/utils"
import { IconRender } from "../icon-render"
import { ICON_LIST } from "@/constants/icons"

type Props = {
  ref: React.RefObject<HTMLButtonElement>
  icon: string
  page?: string
  channelId: string
  currentIcon?: string
  onSetIcon(icon: string): void
}

const IconDropdown = ({
  ref,
  icon,
  page,
  channelId,
  currentIcon,
  onSetIcon,
}: Props) => {
  return (
    <DropDown
      ref={ref}
      title="Pick your icon"
      trigger={
        <span>
          <IconRender
            icon={icon}
            mode={page === channelId ? "LIGHT" : "DARK"}
          />
        </span>
      }
    >
      {ICON_LIST.map(
        (icons) =>
          icons.icon !== icon && (
            <span
              key={icons.id}
              className={cn(
                currentIcon === icons.icon ? "bg-themeGray" : "",
                "p-2 rounded-lg",
              )}
              onClick={() => onSetIcon(icons.icon)}
            >
              <IconRender
                icon={icons.icon}
                mode={page === channelId ? "LIGHT" : "DARK"}
              />
            </span>
          ),
      )}
    </DropDown>
  )
}

export default IconDropdown
