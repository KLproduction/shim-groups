"use client"
import BlockTextEditor from "@/components/global/rich-text-editor"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCreateChannelPost } from "@/hooks/channels"

import { Upload } from "lucide-react"
import { Dispatch } from "react"

type PostContentProps = {
  channelid: string
}

export const PostContent = ({ channelid }: PostContentProps) => {
  const {
    errors,
    register,
    onDescription,
    onJsonDescription,
    onHtmlDescription,
    setOnDescription,
    setOnHtmlDescription,
    setJsonDescription,
    onCreatePost,
  } = useCreateChannelPost(channelid)

  return (
    <form className="flex flex-col gap-y-5 w-full" onSubmit={onCreatePost}>
      <Input
        placeholder="Title"
        className="bg-transparent outline-none border-none text-2xl p-0"
        {...register("title")}
      />
      <BlockTextEditor
        errors={errors}
        name="jsoncontent"
        min={1}
        max={10000}
        inline
        onEdit
        textContent={onDescription}
        content={onJsonDescription}
        setContent={setJsonDescription}
        setTextContent={setOnDescription}
        htmlContent={onHtmlDescription}
        setHtmlContent={setOnHtmlDescription}
      />

      <Button className="self-end rounded-2xl bg-themeTextGray flex gap-x-2">
        <Upload />
        Create
      </Button>
    </form>
  )
}
