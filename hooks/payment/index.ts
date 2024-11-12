"use client"

import {
  onActivateSubscription,
  onCreateNewGroupSubscription,
  onGetGroupSubscriptionPaymentIntent,
  onGetStripeClientSecret,
  onTransferCommission,
} from "@/actions/payment"
import { CreateGroupSubscriptionSchema } from "@/components/forms/group-subscription/schema"
import {
  onCreateNewGroup,
  onGetGroupChannels,
  onGetGroupSubscriptions,
  onJoinGroup,
} from "@/data/groups"
import { CreateGroupSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe, StripeCardElement } from "@stripe/stripe-js"
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const useStripeElements = () => {
  const StripePromise = async () =>
    await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)
  console.log("StripePromise:", StripePromise)
  return { StripePromise }
}

export const usePayments = (
  userId: string,
  affiliate: boolean,
  stripeId?: string,
) => {
  const stripe = useStripe()
  const elements = useElements()
  const route = useRouter()
  const [isCategory, setIsCategory] = useState<string | undefined>(undefined)
  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm<z.infer<typeof CreateGroupSchema>>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      category: "",
    },
  })

  useEffect(() => {
    const category = watch(({ category }) => {
      setIsCategory(category)
    })
    return () => category.unsubscribe()
  }, [watch])

  const { data: Intent, isPending: creatingIntent } = useQuery({
    queryKey: ["payment-intent"],
    queryFn: () => onGetStripeClientSecret(),
  })

  const { mutateAsync: createGroup, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof CreateGroupSchema>) => {
      if (!stripe || !elements || !Intent) {
        return null
      }
      console.log(Intent)
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        Intent.secret!,
        {
          payment_method: {
            card: elements.getElement(CardElement) as StripeCardElement,
          },
        },
      )

      if (error) {
        return toast.error("Oops! something went wrong, try again later")
      }

      if (paymentIntent.status === "succeeded") {
        if (affiliate) {
          await onTransferCommission(stripeId!)
        }
      }
      const created = await onCreateNewGroup(userId, data)
      if (created && created.status === 200) {
        toast.success(created.message)
      }
      route.push(
        `/group/${created?.data?.group[0].id}/channel/${created?.data?.group[0].channel[0].id}`,
      )

      if (created && created.status !== 200) {
        reset()
        return toast.error(created.message)
      }
    },
  })
  const onCreateGroup = handleSubmit(async (values) => createGroup(values))

  return {
    onCreateGroup,
    isPending,
    register,
    errors,
    isCategory,
    creatingIntent,
  }
}

export const useJoinGroup = (groupId: string) => {
  const stripe = useStripe()
  const elements = useElements()
  const route = useRouter()

  const { data: Intent } = useQuery({
    queryKey: ["group-payment-intent"],
    queryFn: () => onGetGroupSubscriptionPaymentIntent(groupId),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements || !Intent) {
        toast.error("Oops! ")
        return null
      }
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        Intent.secret!,
        {
          payment_method: {
            card: elements.getElement(CardElement) as StripeCardElement,
          },
        },
      )
      if (error) {
        return toast.error("Oops! something went wrong, try again later")
      }
      if (paymentIntent.status === "succeeded") {
        const member = await onJoinGroup(groupId)
        if (member.status === 200) {
          const channels = await onGetGroupChannels(groupId)
          if (channels && channels.channels && channels.status === 200) {
            toast.success(
              "You have successfully joined the group, redirecting...",
            )

            route.push(`/group/${groupId}/channel/${channels.channels[0].id}`)
          }
        }
      }
    },
  })
  const onPayToJoin = () => mutate()

  return { onPayToJoin, isPending }
}

export const useGroupSubscription = (groupId: string) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<z.infer<typeof CreateGroupSubscriptionSchema>>({
    resolver: zodResolver(CreateGroupSubscriptionSchema),
  })
  const query = useQueryClient()

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (data: { price: string }) =>
      onCreateNewGroupSubscription(groupId, data.price),
    onMutate: () => reset(),
    onSuccess: (data) => {
      return data.status !== 200
        ? toast.error(data.message)
        : toast.success(data.message)
    },
    onSettled: async () => {
      return await query.invalidateQueries({
        queryKey: ["group-subscriptions"],
      })
    },
  })

  const onCreateNewSubscription = handleSubmit(async (values) =>
    mutate({ ...values }),
  )
  return {
    register,
    errors,
    onCreateNewSubscription,
    isPending,
    variables,
  }
}

export const useAllSubscriptions = (groupId: string) => {
  const route = useRouter()
  const { data } = useQuery({
    queryKey: ["group-subscriptions"],
    queryFn: () => onGetGroupSubscriptions(groupId),
  })

  const query = new QueryClient()

  const { mutate } = useMutation({
    mutationFn: (data: { id: string }) => onActivateSubscription(data.id),
    onSuccess: (data) => {
      return data?.status !== 200
        ? toast.error(data?.message)
        : toast.success(data.message)
    },
    onSettled: async () => {
      return await query.invalidateQueries({
        queryKey: ["group-subscriptions"],
      })
    },
  })
  return {
    data,
    mutate,
  }
}
