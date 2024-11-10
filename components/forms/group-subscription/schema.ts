import * as z from "zod"
export const CreateGroupSubscriptionSchema = z.object({
  price: z.string({
    required_error: "Price is required",
  }),
})
