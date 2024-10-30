import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import Logo from "@/icons/logo"
import GroupLogo from "../GroupLogo"

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
})

interface HeaderProps {
    label: string
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
            <GroupLogo size="large" />
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}
