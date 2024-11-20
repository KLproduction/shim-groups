"use client"

import { useCreateCourse } from "@/hooks/courses"
import React from "react"
import GlassModal from "../glass-modal"
import { Card, CardContent } from "@/components/ui/card"

import { FormGenerator } from "../form-generator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@hookform/error-message"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { BadgePlus } from "lucide-react"

type Props = {
  groupId: string
}

const CourseCreate = ({ groupId }: Props) => {
  const {
    onCreateCourse,
    register,
    errors,
    buttonRef,
    variables,
    isPending,
    onPrivacy,
    data,
    setValue,
  } = useCreateCourse(groupId)
  if (data?.groupOwner) {
    return (
      <GlassModal
        title="Create new course"
        description="Create a new course for your community"
        trigger={
          <span>
            <Card
              className="bg-[#101011] border-themeGray hover:bg-themeBlack transition duration-100
          cursor-pointer border-dashed aspect-square rounded-xl h-[400px]"
            >
              <CardContent className=" opacity-20 flex gap-2 p-0 justify-center items-center h-full">
                <BadgePlus />
                <p>Create Course</p>
              </CardContent>
            </Card>
          </span>
        }
      >
        <form onSubmit={onCreateCourse} className="flex flex-col gap-y-5 mt-5">
          <FormGenerator
            register={register}
            errors={errors}
            name="name"
            placeholder="Add your course name"
            inputType="input"
            type="text"
            label="Course Name"
          />
          <FormGenerator
            register={register}
            errors={errors}
            name="description"
            placeholder="Add your course description"
            inputType="textarea"
            type="text"
            label="Course description"
          />
          <div className="grid gap-2 grid-cols-2">
            <Label htmlFor="r1">
              <span>
                <Input
                  className="hidden"
                  type="radio"
                  {...register("privacy")}
                  id="r1"
                  value={"open"}
                />
                <Card
                  className={cn(
                    "py-5 flex justify-center border-themeGray font-bold text-themeTextGray cursor-pointer",
                    onPrivacy === "open" ? "bg-themeBlack" : "bg-transparent",
                  )}
                >
                  Open
                </Card>
              </span>
            </Label>
            <Label htmlFor="r2">
              <span>
                <Input
                  className="hidden"
                  type="radio"
                  {...register("privacy")}
                  id="r2"
                  value={"privacy"}
                />
                <Card
                  className={cn(
                    "py-5 flex justify-center border-themeGray font-bold text-themeTextGray cursor-pointer",
                    onPrivacy === "open" ? "bg-themeBlack" : "bg-transparent",
                  )}
                >
                  Privacy
                </Card>
              </span>
              <div className="col-span-3">
                <ErrorMessage
                  errors={errors}
                  name="privacy"
                  render={({ message }) => (
                    <p className="text-red-500 mt-2">
                      {message === "Required" ? "" : message}
                    </p>
                  )}
                />
              </div>
            </Label>
            <Label htmlFor="course-image" className="col-span-2 mt-3">
              <span>
                <Input
                  className="hidden"
                  type="file"
                  id="course-image"
                  {...register("image")}
                />
                <Card
                  className="bg-transparent text-themeTextGray flex justify-center items-center border-themeGray
                  hover:bg-themeBlack transition duration-100 cursor-pointer border-dashed aspect-video rounded-xl"
                >
                  Upload Image
                </Card>
              </span>
              <ErrorMessage
                errors={errors}
                name="image"
                render={({ message }) => (
                  <p className="text-red-500 mt-2">
                    {message === "Required" ? "" : message}
                  </p>
                )}
              />
            </Label>
            <div className=" flex items-center justify-end space-x-2 mt-3 col-span-2">
              <Switch
                id="publish-mode"
                onCheckedChange={(e) => setValue("published", e)}
                className="data-[state=checked]:bg-themeTextGray data-[state=unchecked]:bg-themeGray"
              />
              <Label htmlFor="publish-mode">Publish Course</Label>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-transparent border-themeGray"
            variant={"outline"}
          >
            Create
          </Button>
          <DialogClose asChild>
            <Button type="button" ref={buttonRef} className="hidden">
              close modal
            </Button>
          </DialogClose>
        </form>
      </GlassModal>
    )
  }
}

export default CourseCreate
