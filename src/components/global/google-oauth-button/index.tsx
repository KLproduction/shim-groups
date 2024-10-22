"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "../loader"
import { useGoogleAuth } from "@/hooks/authentication"
import { Google } from "@/icons"

type Props = {
    method: "signup" | "signin"
}

const GoogleAuthButton = ({ method }: Props) => {
    const { signUpWith, signInWith } = useGoogleAuth()
    return (
        <>
            <Button
                onClick={
                    method === "signup"
                        ? () => signUpWith("oauth_google")
                        : () => signInWith("oauth_google")
                }
                className="w-full rounded-2xl flex gap-3 bg-themeBlack border-themeGray "
                variant={"outline"}
            >
                <Loader loading={false}>
                    <Google />
                    Google
                </Loader>
            </Button>
        </>
    )
}

export default GoogleAuthButton
