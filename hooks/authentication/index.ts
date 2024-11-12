"use client"

import { SignUpSchema } from "@/components/forms/sign-up/schema"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { getUserByEmail, onAuthenticatedUser } from "@/data/user"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getTwoFactorTokenbyEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail"
import { AuthError } from "next-auth"
import { onNextAuthSignIn } from "@/actions/onNextAuthSignIn"
import { ExtenderUser } from "@/next-auth"
import { currentUser } from "@/lib/auth"

type Props = {}

export const useAuthSignIn = () => {
  const router = useRouter()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  })

  const nextAuthCheck = async (
    email: string,
    password: string,
    code?: string,
  ) => {
    await onNextAuthSignIn(email, password, code).then((res) => {
      if (res?.status === 200) {
        reset()
        router.push("/")
      } else {
        return
      }
    })
  }

  const { mutate: InitiateLoginFlow, isPending } = useMutation({
    mutationFn: ({
      email,
      password,
      code,
    }: {
      email: string
      password: string
      code?: string
    }) => onNextAuthSignIn(email, password, code),
  })

  const onAuthenticateUser = handleSubmit(async (values) => {
    InitiateLoginFlow({
      email: values.email,
      password: values.password,
      code: values.code,
    })
  })

  return {
    onAuthenticateUser,
    isPending,
    register,
    errors,
  }
}

// export const useAuthSignUp = () => {
//     const { setActive, isLoaded, signUp } = useSignUp()
//     const [creating, setCreating] = useState(false)
//     const [verifying, setVerifying] = useState<boolean>(false)
//     const [code, setCode] = useState("")
//     const router = useRouter()

//     const {
//         register,
//         formState: { errors },
//         handleSubmit,
//         getValues,
//         reset,
//     } = useForm<z.infer<typeof SignUpSchema>>({
//         resolver: zodResolver(SignUpSchema),
//         mode: "onBlur",
//     })

//     const onGenerateCode = async (email: string, password: string) => {
//         if (!isLoaded) return toast.error("Oops something went wrong")
//         try {
//             if (email && password) {
//                 await signUp.create({
//                     emailAddress: getValues("email"),
//                     password: getValues("password"),
//                 })

//                 await signUp.prepareEmailAddressVerification({
//                     strategy: "email_code",
//                 })
//                 setVerifying(true)
//             } else {
//                 return toast.error("No fields must be empty")
//             }
//         } catch (err: any) {
//             console.error(JSON.stringify(err, null, 2))
//         }
//     }

//     const OnInitiateUserRegistration = handleSubmit(async (values) => {
//         if (!isLoaded) return toast.error("Oops something went wrong")

//         try {
//             setCreating(true)
//             const completeSignUp = await signUp.attemptEmailAddressVerification(
//                 {
//                     code,
//                 },
//             )

//             if (completeSignUp.status !== "complete") {
//                 return toast.error("Something went wrong")
//             }

//             if (completeSignUp.status === "complete") {
//                 if (!signUp.createdUserId) return
//                 const user = await onSignUpUser({
//                     firstname: values.firstname,
//                     lastname: values.lastname,
//                     clerkId: signUp.createdUserId,
//                     image: "",
//                 })

//                 reset()

//                 if (user.status === 200) {
//                     toast.success(user.message)
//                     await setActive({
//                         session: completeSignUp.createdSessionId,
//                     })
//                     router.push("/group/create")
//                 }

//                 if (user.status !== 200) {
//                     toast.error(user.message + "action failed")
//                 }
//             }
//         } catch (err: any) {
//             console.error(JSON.stringify(err, null, 2))
//         }
//     })

//     return {
//         register,
//         errors,
//         onGenerateCode,
//         OnInitiateUserRegistration,
//         verifying,
//         creating,
//         code,
//         setCode,
//         getValues,
//     }
// }

export const useLoginAuth = () => {
  const { signIn, isLoaded: LoadedSignIn } = useSignIn()
  const { signUp, isLoaded: LoadedSignUp } = useSignUp()

  const signInWith = (strategy: OAuthStrategy) => {
    if (!LoadedSignIn) return
    try {
      return signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/callback",
        redirectUrlComplete: "/callback/sign-in",
      })
    } catch (error) {
      console.error(error)
    }
  }

  const signUpWith = (strategy: OAuthStrategy) => {
    if (!LoadedSignUp) return
    try {
      return signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/callback",
        redirectUrlComplete: "/",
      })
    } catch (error) {
      console.error(error)
    }
  }

  return { signUpWith, signInWith }
}
