"use client"

import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Google } from "@/icons"
import { Separator } from "../ui/separator"

export const Social = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: "/callback/sign-in",
        })
    }
    return (
        <div className="w-full">
            <div className="my-10 w-full relative ">
                <div className="bg-black p-3 absolute text-themeTextGray text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    Or Login With
                </div>
                <Separator orientation="horizontal" className="bg-themeGray" />
            </div>
            <div className="flex w-full items-center justify-center gap-10 ">
                <Button
                    size={"lg"}
                    className="flex items-center gap-2 bg-transparent border-themeGray"
                    variant={"outline"}
                    onClick={() => onClick("google")}
                >
                    <Google />
                    Google
                </Button>
                <Button
                    size={"lg"}
                    className="flex items-center gap-2 bg-transparent border-themeGray"
                    variant={"outline"}
                    onClick={() => onClick("github")}
                >
                    <GitHubLogoIcon />
                    GitHub
                </Button>
            </div>
        </div>
    )
}
