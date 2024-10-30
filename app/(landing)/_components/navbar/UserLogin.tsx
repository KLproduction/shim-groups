import SignOutBtn from "@/components/auth/SignOutBtn"
import { Button } from "@/components/ui/button"
import { Logout } from "@/icons"
import { currentUser } from "@/lib/auth"
import Link from "next/link"
import React from "react"

type Props = {}

const UserLogin = async (props: Props) => {
    const user = await currentUser()
    return (
        <div>
            {user?.id ? (
                <div className="flex items-center gap-3">
                    {user.name}
                    <SignOutBtn />
                </div>
            ) : (
                <Link href={"/sign-in"} className=" flex items-center gap-3">
                    <Button
                        variant={"outline"}
                        className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
                    >
                        <Logout />
                        Login
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default UserLogin
