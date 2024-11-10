"use client"

import SubscriptionCard from "@/app/group/[groupid]/settings/subscriptions/_components/subscription-card"
import { FormGenerator } from "@/components/global/form-generator"
import GlassModal from "@/components/global/glass-modal"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGroupSubscription } from "@/hooks/payment"
import { Tag } from "lucide-react"

type GroupSubscriptionFormProps = {
  groupId: string
}

export const GroupSubscriptionForm = ({
  groupId,
}: GroupSubscriptionFormProps) => {
  const { onCreateNewSubscription, register, errors, isPending, variables } =
    useGroupSubscription(groupId)
  return (
    <>
      <GlassModal
        trigger={
          <span>
            <Card className="flex rounded-xl text-themeGray gap-x-2 items-center cursor-pointer justify-center aspect-video border-dashed bg-themeBlack border-themeGray">
              <Tag />
              <p>Add a price</p>
            </Card>
          </span>
        }
        title="Create a subscription"
        description="Create a subscription plan for your grouple group"
      >
        <form
          onSubmit={onCreateNewSubscription}
          className="flex flex-col gap-y-3"
        >
          <FormGenerator
            register={register}
            errors={errors}
            name="price"
            inputType="input"
            type="text"
            placeholder="Add a price..."
          />
          <Button>
            <Loader loading={isPending}>Create</Loader>
          </Button>
        </form>
      </GlassModal>
      {isPending && variables && (
        <SubscriptionCard optimisitc price={`${variables.price}`} members="0" />
      )}
    </>
  )
}
