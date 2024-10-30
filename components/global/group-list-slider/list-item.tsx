"use client"

import { cn } from "@/lib/utils"

type GroupListItemProps = {
    icon: JSX.Element
    label: string
    selected?: string
    path: string
}

export const GroupListItem = ({
    icon,
    label,
    selected,
    path,
}: GroupListItemProps) => {
    return (
        <div
            className={cn(
                "flex gap-3 items-center py-2 px-4 rounded-2xl bg-themeGray border-2 cursor-pointer",
                selected === path
                    ? "border-themeTextGray font-bold text-white"
                    : "border-themeGray text-gray-500",
            )}
        >
            {icon}
            <span>{label}</span>
        </div>
    )
}
