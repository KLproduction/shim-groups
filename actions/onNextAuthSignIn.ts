"use server"

import { signIn } from "@/auth"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getTwoFactorTokenbyEmail } from "@/data/two-factor-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { AuthError } from "next-auth"

import { toast } from "sonner"
import { reset } from "./reset"

export const onNextAuthSignIn = async (
    email: string,
    password: string,
    code?: string,
) => {
    try {
        const existingUser = await getUserByEmail(email)

        if (!existingUser || !existingUser.email || !existingUser.password) {
            toast.error("Email does not exist!")
            return { status: 404 }
        }

        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(
                existingUser.email,
            )
            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token,
            )
            toast.success(
                "Please check your email, confirmation email has been sent.",
            )
            return
        }

        if (existingUser.isTwoFactorEnabled && existingUser.email) {
            if (code) {
                const twoFactorToken = await getTwoFactorTokenbyEmail(
                    existingUser.email,
                )
                if (!twoFactorToken) {
                    toast.error("Invalid code!")
                    return
                }

                if (twoFactorToken.token !== code) {
                    toast.error("Invalid code!")
                    return
                }

                const hasExpired = new Date(twoFactorToken.expires) < new Date()
                if (hasExpired) {
                    toast.error("Code expired!")
                    return
                }

                await db.twoFactorToken.delete({
                    where: { id: twoFactorToken.id },
                })

                const existingConfirmation =
                    await getTwoFactorConfirmationByUserId(existingUser.id)
                if (existingConfirmation) {
                    await db.twoFactorConfirmation.delete({
                        where: { id: existingConfirmation.id },
                    })
                }

                await db.twoFactorConfirmation.create({
                    data: {
                        userId: existingUser.id,
                    },
                })
            } else {
                const twoFactorToken = await generateTwoFactorToken(
                    existingUser.email,
                )
                await sendTwoFactorTokenEmail(
                    existingUser.email,
                    twoFactorToken.token,
                )
                toast.info("Two-factor authentication code sent!")
                return
            }
        }

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if (result?.error) {
            toast.error("Incorrect email/password, please try again")
        } else {
            toast.success("Signed in successfully")
            return {
                status: 200,
            }
        }
    } catch (e: any) {
        if (e instanceof AuthError) {
            switch (e.type) {
                case "CredentialsSignin":
                    toast.error("Invalid credentials!")
                    break
                default:
                    toast.error("Invalid credentials!")
            }
        } else {
            console.error(e)
            toast.error("Oops, something went wrong")
        }
    }
}
