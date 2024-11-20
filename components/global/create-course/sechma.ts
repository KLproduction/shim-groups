import {
  ACCEPTED_FILE_TYPES,
  MAX_UPLOAD_SIZE,
} from "@/components/forms/group-settings/schema"
import { z } from "zod"

export const CreateCourseSchema = z.object({
  name: z.string().min(3, {
    message: "Group name must be at at least 3 characters long",
  }),
  description: z.string().min(100, {
    message: "Group description must be at at least 100 characters long",
  }),
  image: z
    .any({
      required_error: "Image is required",
    })
    .refine((files) => files?.[0]?.size <= MAX_UPLOAD_SIZE, {
      message: `Image size should be less than 2MB`,
    })
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
      message: "Only JPG,JPEG & PNG are accepted file formats",
    }),
  privacy: z.string().min(1, {
    message: "You need to pick a privacy setting",
  }),
  published: z.boolean(),
})
