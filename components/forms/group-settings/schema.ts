import { z } from "zod"

export const MAX_UPLOAD_SIZE = 12024 * 1024 * 2
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"]

export const GroupSettingsSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Group name must be at at least 3 characters long",
      })
      .optional()
      .or(z.literal("").transform(() => undefined)),

    description: z
      .string()
      .min(100, {
        message: "Group description must be at at least 100 characters long",
      })
      .optional()
      .or(z.literal("").transform(() => undefined)),

    icon: z.any().optional(),
    thumbnail: z.any().optional(),
    htmldescription: z
      .string()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    jsondescription: z
      .string()
      .min(100, {
        message: "Group description must be at at least 100 characters long",
      })
      .optional()
      .or(z.literal("").transform(() => undefined)),
  })
  .refine(
    (schema) => {
      if (schema && schema?.icon && schema.icon?.length) {
        if (
          ACCEPTED_FILE_TYPES.includes(schema.icon?.[0].type!) &&
          schema.icon?.[0].size <= MAX_UPLOAD_SIZE
        ) {
          return true
        }
      }
      if (!schema.icon?.length) {
        return true
      }
    },
    {
      message:
        "The image must be less then 2MB, and on PNG, JPEG & JPG files are accepted",
      path: ["icon"],
    },
  )
  .refine(
    (schema) => {
      if (schema.thumbnail?.length) {
        if (
          ACCEPTED_FILE_TYPES.includes(schema.thumbnail?.[0].type!) &&
          schema.thumbnail?.[0].size <= MAX_UPLOAD_SIZE
        ) {
          return true
        }
      }
      if (!schema.thumbnail?.length) {
        return true
      }
    },
    {
      message:
        "The image must be less then 2MB, and on PNG, JPEG & JPG files are accepted",
      path: ["thumbnail"],
    },
  )
