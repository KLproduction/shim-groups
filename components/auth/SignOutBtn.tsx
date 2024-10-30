"use client"
import { signOutAction } from "@/actions/signOut"
import { Button } from "../ui/button"
import { CgLogOut } from "react-icons/cg"
import { useRouter } from "next/navigation"

const SignOutBtn = () => {
    const route = useRouter()
    const onClickHandler = async () => {
        await signOutAction().then(() => {
            route.push("/callback/sign-in")
        })
    }

    return (
        <div className="flex items-center">
            <Button
                onClick={() => onClickHandler()}
                variant={"ghost"}
                size={"sm"}
            >
                <div className="mr-3 flex">Sign Out</div>
                <div className="text-lg">
                    <CgLogOut />
                </div>
            </Button>
        </div>
    )
}

export default SignOutBtn
