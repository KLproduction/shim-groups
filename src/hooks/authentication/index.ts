import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInSchema } from "../../components/forms/sign-in/schema"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { on } from "events"
import { use, useState } from "react"
import { SignUpSchema } from "@/components/forms/sign-up/schema"
import { onSignUpUser } from "@/actions/auth"
import { OAuthStrategy } from "@clerk/types"

type Props = {}

export const useAuthSignIn = () => {
    const router = useRouter()
    const { isLoaded, setActive, signIn } = useSignIn()
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        mode: "onBlur",
    })

    const onClerkAuth = async (email: string, password: string) => {
        if (!isLoaded) return toast.error("Oops something went wrong")
        try {
            const authenticated = await signIn.create({
                identifier: email,
                password,
            })

            if (authenticated.status === "complete") {
                reset()
                await setActive({ session: authenticated.createdSessionId })
                toast.success("Signed in successfully")
            }
            router.push("/callback/sign-in")
        } catch (err: any) {
            if (err.errors[0].code === "form_password_incorrect") {
                toast.error("Incorrect email/password try again")
            }
            console.error(err)
        }
    }
    const { mutate: InitiateLoginFlow, isPending } = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string
            password: string
        }) => onClerkAuth(email, password),
    })

    const onAuthenticateUser = handleSubmit(async (values) => {
        InitiateLoginFlow({ email: values.email, password: values.password })
    })

    return {
        onAuthenticateUser,
        isPending,
        register,
        errors,
    }
}

export const useAuthSignUp = () => {
    const { setActive, isLoaded, signUp } = useSignUp()
    const [creating, setCreating] = useState(false)
    const [verifying, setVerifying] = useState<boolean>(false)
    const [code, setCode] = useState("")
    const router = useRouter()

    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        reset,
    } = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        mode: "onBlur",
    })

    const onGenerateCode = async (email: string, password: string) => {
        if (!isLoaded) return toast.error("Oops something went wrong")
        try {
            if (email && password) {
                await signUp.create({
                    emailAddress: getValues("email"),
                    password: getValues("password"),
                })

                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                })
                setVerifying(true)
            } else {
                return toast.error("No fields must be empty")
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const OnInitiateUserRegistration = handleSubmit(async (values) => {
        if (!isLoaded) return toast.error("Oops something went wrong")

        try {
            setCreating(true)
            const completeSignUp = await signUp.attemptEmailAddressVerification(
                {
                    code,
                },
            )

            if (completeSignUp.status !== "complete") {
                return toast.error("Something went wrong")
            }

            if (completeSignUp.status === "complete") {
                if (!signUp.createdUserId) return
                const user = await onSignUpUser({
                    firstname: values.firstname,
                    lastname: values.lastname,
                    clerkId: signUp.createdUserId,
                    image: "",
                })

                reset()

                if (user.status === 200) {
                    toast.success(user.message)
                    await setActive({
                        session: completeSignUp.createdSessionId,
                    })
                    router.push("/group/create")
                }

                if (user.status !== 200) {
                    toast.error(user.message + "action failed")
                }
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    })

    return {
        register,
        errors,
        onGenerateCode,
        OnInitiateUserRegistration,
        verifying,
        creating,
        code,
        setCode,
        getValues,
    }
}

export const useGoogleAuth = () => {
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
        } catch (err) {
            console.error(err)
        }
    }
    const signUpWith = (strategy: OAuthStrategy) => {
        if (!LoadedSignIn) return

        try {
            return signUp?.authenticateWithRedirect({
                strategy,
                redirectUrl: "/callback",
                redirectUrlComplete: "/callback/sign-in",
            })
        } catch (err) {
            console.error(err)
        }
    }
    return {
        signInWith,
        signUpWith,
    }
}
