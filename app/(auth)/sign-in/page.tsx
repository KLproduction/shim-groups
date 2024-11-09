"use client"

import GitSignInBtn from "@/components/auth/GitSignInBtn"
import GoogleSignInBtn from "@/components/auth/GoogleSignInBtn"
import { LoginForm } from "@/components/forms/LoginForm"
import SignInForm from "@/components/forms/sign-in"
import { Separator } from "@/components/ui/separator"
import { currentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type Props = {}

const SignInPage = (props: Props) => {
  const route = useRouter()
  useEffect(() => {
    ;(async () => {
      const user = await currentUser()
      if (user) {
        route.push("/callback/sign-in")
      }
    })()
  }, [])
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col relative">
      <div className="absolute top-[20%] right-[50%] translate-x-[50%] mb-10 pb-10">
        <LoginForm />
      </div>
    </div>
  )
}

export default SignInPage
