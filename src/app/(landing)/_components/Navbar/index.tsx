"use client"

import Logo from "@/icons/logo"
import Menu from "./menu"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logout } from "@/icons"
import GlassSheet from "@/components/global/form-generator/glass-sheet"
import { MenuIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type Props = {}

const LandingPageNavbar = (props: Props) => {
    const [isScroll, setIsScroll] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScroll(true)
            } else {
                setIsScroll(false)
            }
        }
        document.addEventListener("scroll", handleScroll)

        return () => {
            document.removeEventListener("scroll", handleScroll)
        }
    }, [])
    return (
        <div
            className={cn(
                " w-full flex justify-between sticky top-0 items-center py-5 z-50 mx-5 h-24 bg-transparent",
            )}
        >
            <Logo size="small" />
            <Menu orientation="desktop" />
            <div className=" flex items-center">
                <Link href={"/sign-in"}>
                    <Button
                        variant={"outline"}
                        className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
                    >
                        <Logout />
                        Login
                    </Button>
                </Link>
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
