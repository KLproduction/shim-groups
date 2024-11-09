"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMediaGallery } from "@/hooks/groups"
import { BadgePlus } from "@/icons"
import React, { useState } from "react"

type Props = {
  groupId: string
}

const MediaGalleryForm = ({ groupId }: Props) => {
  const { errors, register, onHandleUpdateGallery, isPending, setValue } =
    useMediaGallery(groupId)

  const [imageCount, setImageCount] = useState(0)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageCount(e.target.files.length)
      setValue("image", e.target.files)
    }
  }

  return (
    <form onSubmit={onHandleUpdateGallery} className=" flex flex-col gap-y-3 ">
      <FormGenerator
        register={register}
        errors={errors}
        name="videoUrl"
        label="Video Link"
        placeholder="Video link..."
        inputType="input"
        type="text"
      />
      <Label htmlFor="media-gallery">
        <p>or Upload an Image</p>
        <span
          className=" border-[1px] border-dashed flex flex-col justify-center items-center py-10 my-2 
        hover:bg-themeGray/50 cursor-pointer border-themeGray bg-themeBlack rounded-lg gay-2 "
        >
          <Input
            type="file"
            className="hidden"
            id="media-gallery"
            multiple
            {...register("image")}
            onChange={handleImageChange}
          />
          <div className="">
            <BadgePlus />
          </div>
          {imageCount > 0 ? (
            <p className="text-sm text-themeTextGray">
              {imageCount} image(s) selected
            </p>
          ) : (
            <p>Drag and drop an image</p>
          )}
        </span>
      </Label>
      <Loader loading={isPending}>
        <Button
          type="submit"
          className="rounded-2xl"
          variant={"outline"}
          disabled={isPending}
        >
          Update
        </Button>
      </Loader>
    </form>
  )
}

export default MediaGalleryForm
