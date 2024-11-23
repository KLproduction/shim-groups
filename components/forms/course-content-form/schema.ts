import { z } from "zod"

export const CourseContentSchema = z.object({
  content: z
    .string()
    .min(100, {
      message: "Content must be at least 100 characters long",
    })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  htmlcontent: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  jsoncontent: z
    .string()
    .min(100, {
      message: "Content must be at least 100 characters long",
    })
    .optional()
    .or(z.literal("").transform(() => undefined)),
})
