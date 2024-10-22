import * as z from "zod"

export const SignInSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Email is invalid" }),
    password: z
        .string()
        .min(8, { message: "Your password must be at least 8 characters long" })
        .min(24, {
            message: "Your password can not be longer then 24 characters .",
        })
        .refine(
            (value) => /^[a-zA-Z0-9]+$/.test(value ?? ""),
            "password should contain only alphabets and numbers",
        ),
})
