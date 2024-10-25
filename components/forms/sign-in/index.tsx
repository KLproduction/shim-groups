"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/global/loader"
import { GROUPLE_CONSTANTS } from "@/constants"
import { LoginSchema } from "@/schemas"
import * as z from "zod"
import { useEffect, useState, useTransition } from "react"
import { login } from "@/actions/login"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthSignIn } from "@/hooks/authentication"
import { currentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

type Props = {}

const SignInForm = (props: Props) => {
    const { isPending, onAuthenticateUser, register, errors } = useAuthSignIn()
    const [isSubmit, setIsSubmit] = useState(false)
    const route = useRouter()

    return (
        <form
            className="flex flex-col gap-3 mt-10"
            onSubmit={onAuthenticateUser}
        >
            {GROUPLE_CONSTANTS.signInForm.map((field) => (
                <FormGenerator
                    {...field}
                    key={field.id}
                    register={register}
                    errors={errors}
                />
            ))}
            <Button
                type="submit"
                className="rounded-2xl"
                // onClick={() => route.push("/callback/sign-in")}
            >
                <Loader loading={isPending}>Sign In with Email</Loader>
            </Button>
        </form>
    )
}
export default SignInForm
