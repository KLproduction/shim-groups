"use client"
import { gitSignIn } from "@/actions/socalSignInAction"
import { Button } from "../ui/button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

const GitSignInBtn = () => {
    return (
        <div>
            <Button
                onClick={() => gitSignIn()}
                variant={"outline"}
                size={"sm"}
                className="flex items-center gap-2 bg-transparent border-themeGray"
            >
                <GitHubLogoIcon />
                GitHub
            </Button>
        </div>
    )
}

export default GitSignInBtn
