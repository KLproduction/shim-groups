import * as z from "zod"

export const SignUpSchema = z.object({
    firstname: z.string().min(3, {
        message: "First name must be at at least 3 characters long",
    }),

    lastname: z
        .string()
        .min(3, { message: "Last name must be at at least 3 characters long" }),

    email: z.string().email({ message: "Email is invalid" }),
    password: z
        .string()
        .min(8, { message: "Your password must be at least 8 characters long" })
        .max(24, {
            message: "Your password can not be longer then 24 characters .",
        })
        .refine(
            (value) => /^[a-zA-Z0-9]+$/.test(value ?? ""),
            "password should contain only alphabets and numbers",
        ),
})
