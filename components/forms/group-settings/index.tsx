"use client"

import GroupCard from "@/app/(discover)/explore/_components/group-card"
import BlockTextEditor from "@/components/global/rich-text-editor"
import { FormGenerator } from "@/components/global/form-generator"
import { Input } from "@/components/ui/input"
import { useGroupSettings } from "@/hooks/groups"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/global/loader"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

type Props = {
  groupId: string
  isOwner: boolean
}

const GroupSettingsForm = ({ groupId, isOwner }: Props) => {
  const {
    data,
    register,
    errors,
    onUpdate,
    isPending,
    preViewIcon,
    preViewThumbnail,
    onJsonDescription,
    setJsonDescription,
    setOnDescription,
    onDescription,
  } = useGroupSettings(groupId)

  const route = useRouter()

  useEffect(() => {
    if (!isOwner) {
      toast.error("Only owner allowed")
      route.push(`/explore`)
    }
  }, [])

  return (
    <form
      className="flex flex-col h-full w-full items-start gap-y-5"
      onSubmit={onUpdate}
    >
      <div className="flex flex-col h-full w-full items-start gap-10 py-5">
        <div className=" flex flex-col gap-3 items-start">
          <p>Group Preview</p>
          <GroupCard
            id={data?.group?.id!}
            createdAt={data?.group?.createdAt!}
            name={data?.group?.name!}
            category={data?.group?.category!}
            userId={data?.group?.userId!}
            privacy={data?.group?.privacy!}
            thumbnail={data?.group?.thumbnail!}
            description={data?.group?.description!}
            preview={preViewThumbnail}
          />
          <Label
            htmlFor="thumbnail-upload"
            className=" border-2 border-themeGray bg-themeGray/50 px-5 py-3 rounded-lg hover:bg-themeBlack cursor-pointer"
          >
            <Input
              type="file"
              id="thumbnail-upload"
              className="hidden"
              {...register("thumbnail")}
            />
            Change Cover
          </Label>
        </div>
        <div className="flex-1 flex- flex-col  py-3 items-start">
          <p>Icon Preview</p>
          <img
            className="w-20 h-20 rounded-xl my-3 object-cover object-center"
            src={
              preViewIcon ||
              (data?.group &&
                data?.group.icon &&
                `https://ucarecdn.com/${data.group.icon}/`) ||
              `https://img.freepik.com/premium-vector/default-image-icon-verctor-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg`
            }
            alt="icon"
          />
          <Label
            className="border-2 border-themeGray bg-themeGray/50 px-5 py-3 rounded-lg cursor-pointer hover:bg-themeBlack flex gap-5"
            htmlFor="icon-upload"
          >
            <Input
              type="file"
              id="icon-upload"
              className="hidden"
              {...register("icon")}
            />
            Change Icon
          </Label>
        </div>
        <div className=" flex flex-col w-full xl:w-8/12 2xl:w-7/12 gap-y-5">
          <FormGenerator
            register={register}
            name="name"
            placeholder={data?.group?.name!}
            label="Group Name"
            errors={errors}
            inputType="input"
            type="text"
          />
          <Label className="flex flex-col gap-y-2">
            <p>Group description</p>
            <BlockTextEditor
              errors={errors}
              name="jsondescription"
              min={150}
              max={10000}
              textContent={onDescription}
              content={onJsonDescription}
              setContent={setJsonDescription}
              setTextContent={setOnDescription}
            />
          </Label>
          <Button className="self-start" type="submit">
            <Loader loading={isPending}>Update Settings</Loader>
          </Button>
        </div>
      </div>
    </form>
  )
}

export default GroupSettingsForm
