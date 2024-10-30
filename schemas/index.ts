import { UserRole } from "@prisma/client"
import * as z from "zod"

export const CreateGroupSchema = z.object({
    name: z.string().min(3, {
        message: "Group name must be at at least 3 characters long",
    }),
    category: z.string().min(3, {
        message: "Your must select a category",
    }),
})

export const SettingSchema = z
    .object({
        name: z.optional(z.string()),
        isTwoFactorEnabled: z.optional(z.boolean()),
        role: z.enum([UserRole.ADMIN, UserRole.USER]),
        email: z.optional(z.string().email()),
        password: z.optional(z.string().min(8)),
        newPassword: z.optional(z.string().min(8)),
    })
    .refine(
        (data) => {
            if (data.password && !data.newPassword) {
                return false
            }

            return true
        },
        {
            message: "New password is required",
            path: ["newPassword"],
        },
    )

    .refine(
        (data) => {
            if (data.newPassword && !data.password) {
                return false
            }

            return true
        },
        {
            message: "Password is required",
            path: ["password"],
        },
    )

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(8, {
        message: "Minimum 8 Characters required",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
})
export const NewPasswordSchema = z.object({
    password: z.string().min(8, {
        message: "Minimum 8 Characters required",
    }),
})
