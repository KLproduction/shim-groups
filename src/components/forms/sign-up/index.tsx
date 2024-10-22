"use client"

import { useAuthSignUp } from "@/hooks/authentication"
import { GROUPLE_CONSTANTS } from "../../../../constants"
import { FormGenerator } from "@/components/global/form-generator"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/global/loader"
import { get } from "http"

type Props = {}

const OtpInput = dynamic(() =>
    import("@/components/global/otp-input").then(
        (component) => component.default,
    ),
)

const SignUpForm = (props: Props) => {
    const {
        register,
        errors,
        verifying,
        creating,
        onGenerateCode,
        OnInitiateUserRegistration,
        code,
        setCode,
        getValues,
    } = useAuthSignUp()
    return (
        <form
            onSubmit={OnInitiateUserRegistration}
            className="flex flex-col gap-3 mt-10"
        >
            {verifying ? (
                <div className="flex justify-center mb-5">
                    <OtpInput otp={code} setOtp={setCode} />
                </div>
            ) : (
                GROUPLE_CONSTANTS.signUpForm.map((field) => (
                    <FormGenerator
                        {...field}
                        key={field.id}
                        register={register}
                        errors={errors}
                    />
                ))
            )}

            {verifying ? (
                <Button type="submit" className="rounded-2xl">
                    <Loader loading={creating}>SignUp with Email</Loader>
                </Button>
            ) : (
                <Button
                    type="submit"
                    className="rounded-2xl"
                    onClick={() =>
                        onGenerateCode(
                            getValues("email"),
                            getValues("password"),
                        )
                    }
                >
                    <Loader loading={false}>Generate Code</Loader>
                </Button>
            )}
        </form>
    )
}

export default SignUpForm
