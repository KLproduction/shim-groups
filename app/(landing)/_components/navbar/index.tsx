"use client"

import GlassSheet from "@/components/global/form-generator/glass-sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import Menu from "./menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import Logo from "@/icons/logo"
import { Logout } from "@/icons"

const LandingPageNavbar = () => {
    const user = useCurrentUser()
    return (
        <div
            className={cn(
                " w-full flex justify-between sticky top-0 items-center py-5 z-50 mx-5 h-24 bg-transparent",
            )}
        >
            <Logo size="small" />
            <Menu orientation="desktop" />
            <div className=" flex items-center">
                {user?.id ? (
                    user.name
                ) : (
                    <Link
                        href={"/sign-in"}
                        className=" flex items-center gap-3"
                    >
                        <Button
                            variant={"outline"}
                            className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
                        >
                            <Logout />
                            Login
                        </Button>
                    </Link>
                )}
                <GlassSheet
                    triggerClassName="lg:hidden"
                    trigger={
                        <Button
                            variant={"ghost"}
                            className="hover:bg-transparent"
                        >
                            <MenuIcon size={30} />
                        </Button>
                    }
                >
                    <Menu orientation="mobile" />
                </GlassSheet>
            </div>
        </div>
    )
}

export default LandingPageNavbar
