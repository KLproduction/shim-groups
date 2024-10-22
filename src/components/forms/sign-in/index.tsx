"use client"

import { useAuthSignIn } from "@/hooks/authentication"
import { GROUPLE_CONSTANTS } from "../../../../constants"
import { FormGenerator } from "@/components/global/form-generator"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/global/loader"

type Props = {}

const SignInForm = (props: Props) => {
    const { isPending, onAuthenticateUser, register, errors } = useAuthSignIn()
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
            <Button type="submit" className="rounded-2xl">
                <Loader loading={isPending}>Sign In with Email</Loader>
            </Button>
        </form>
    )
}
export default SignInForm
