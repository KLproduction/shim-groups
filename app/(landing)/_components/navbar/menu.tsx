"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useNavigation } from "@/hooks/navigation"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { GROUPLE_CONSTANTS } from "@/constants"

type MenuProps = {
    orientation: "desktop" | "mobile"
}

const Menu = ({ orientation }: MenuProps) => {
    const { section, onSetSection } = useNavigation()
    switch (orientation) {
        case "desktop":
            return (
                <Card className="bg-themeGray border-themeGray bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex hidden rounded-xl">
                    <CardContent className="p-0 flex gap-2">
                        {GROUPLE_CONSTANTS.landingPageMenu.map(
                            (menuItem, index) => (
                                <div key={index}>
                                    <Link
                                        href={menuItem.path}
                                        {...(menuItem.section && {
                                            onClick: () => {
                                                onSetSection(menuItem.path)
                                            },
                                        })}
                                        className={cn(
                                            "rounded-xl flex gap-2 py-2 px-4 items-center",
                                            section === menuItem.path
                                                ? "bg-[#09090B] border-[#27272A]"
                                                : "",
                                        )}
                                    >
                                        {menuItem.icon}
                                        {menuItem.label}
                                    </Link>
                                </div>
                            ),
                        )}
                    </CardContent>
                </Card>
            )
        case "mobile":
            return (
                <div>
                    <div className="flex flex-col mt-10">
                        {GROUPLE_CONSTANTS.landingPageMenu.map((menuItem) => (
                            <Link
                                href={menuItem.path}
                                {...(menuItem.section && {
                                    onClick: () => onSetSection(menuItem.path),
                                })}
                                className={cn(
                                    "rounded-xl flex gap-2 py-2 px-4 items-center",
                                    section == menuItem.path
                                        ? "bg-themeGray border-[#27272A]"
                                        : "",
                                )}
                                key={menuItem.id}
                            >
                                {menuItem.icon}
                                {menuItem.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )

        default:
            return <></>
    }
}

export default Menu
