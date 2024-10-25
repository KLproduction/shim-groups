"use client"

import GitSignInBtn from "@/components/auth/GitSignInBtn"
import GoogleSignInBtn from "@/components/auth/GoogleSignInBtn"
import { LoginForm } from "@/components/forms/LoginForm"
import SignInForm from "@/components/forms/sign-in"
import { Separator } from "@/components/ui/separator"

type Props = {}

const SignInPage = (props: Props) => {
    return (
        <div className="mt-3">
            <LoginForm />
        </div>
    )
}

export default SignInPage
