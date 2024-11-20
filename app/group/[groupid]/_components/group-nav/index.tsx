"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GROUPLE_CONSTANTS } from "@/constants"
import { useNavigation } from "@/hooks/navigation"
import { Chat, Document } from "@/icons"
import { Buisness } from "@/icons/buisness"
import { Courses } from "@/icons/courses"
import { Home } from "@/icons/home"
import { PersonalDevelopment } from "@/icons/personal-development"
import { cn } from "@/lib/utils"
import Link from "next/link"

type MenuProps = {
  orientation: "mobile" | "desktop"
  groupId: string
  channelId: string
}

const GroupNav = ({ orientation, groupId, channelId }: MenuProps) => {
  const { section, onSetSection } = useNavigation()
  const navList = [
    {
      id: 0,
      label: "Group",
      icon: <Home />,
      path: `/group/${groupId}`,
      section: true,
    },
    {
      id: 1,
      label: "Courses",
      icon: <Courses />,
      path: `/group/${groupId}/courses`,
      section: true,
    },
    {
      id: 2,
      label: "Events",
      icon: <Buisness />,
      path: "/explore",
    },
    {
      id: 3,
      label: "Members",
      icon: <PersonalDevelopment />,
      path: "/explore",
    },
    {
      id: 4,
      label: "About",
      icon: <Document />,
      path: "/explore",
    },
    {
      id: 5,
      label: "Huddle",
      icon: <Chat />,
      path: "/explore",
    },
  ]
  switch (orientation) {
    case "desktop":
      return (
        <Card className="bg-themeGray border-themeGray bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex  md:rounded-xl flex items-center justify-center w-fit">
          <CardContent className="p-0 flex gap-2">
            {navList.map((menuItem) => (
              <Link
                href={menuItem.path}
                onClick={() => onSetSection(menuItem.path)}
                className={cn(
                  "rounded-xl flex gap-2 py-2 px-4 items-center",
                  section == menuItem.path
                    ? "bg-[#09090B] border-[#27272A]"
                    : "",
                )}
                key={menuItem.id}
              >
                {section == menuItem.path && menuItem.icon}
                {menuItem.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      )

    case "mobile":
      return (
        <div className="flex flex-col mt-10">
          {GROUPLE_CONSTANTS.groupPageMenu.map((menuItem) => (
            <Link
              href={menuItem.path}
              onClick={() => onSetSection(menuItem.path)}
              className={cn(
                "rounded-xl flex gap-2 py-2 px-4 items-center",
                section == menuItem.path ? "bg-themeGray border-[#27272A]" : "",
              )}
              key={menuItem.id}
            >
              {menuItem.icon}
              {menuItem.label}
            </Link>
          ))}
        </div>
      )
    default:
      return <></>
  }
}

export default GroupNav
