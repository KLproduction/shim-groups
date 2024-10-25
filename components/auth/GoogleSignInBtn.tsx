"use client"
import { googleSignIn } from "@/actions/socalSignInAction"
import { Button } from "../ui/button"
import { Google } from "@/icons"

const GoogleSignInBtn = () => {
    return (
        <div>
            <Button
                onClick={() => googleSignIn()}
                variant={"outline"}
                size={"sm"}
                className=" flex items-center gap-2 bg-transparent border-themeGray"
            >
                <Google />
                Google
            </Button>
        </div>
    )
}

export default GoogleSignInBtn
