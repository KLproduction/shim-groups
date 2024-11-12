"use client"

import NoResult from "@/components/global/search/no-result"
import { useGroupAbout, useGroupInfo } from "@/hooks/groups"

import MediaGallery from "./meida-gallery"
import HTMLparser from "@/components/global/html-parser"
import BlockTextEditor from "@/components/global/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/global/loader"

type Props = {
  userId: string
  groupId: string
}

const AboutGroup = ({ userId, groupId }: Props) => {
  const group = useGroupInfo(groupId)
  if (!group) {
    return <Loader loading={true}>Loading</Loader>
  }

  const {
    setOnDescription,
    setOnHtmlDescription,
    setOnJsonDescription,
    onSetDescription,
    onUpdateDescription,
    onSetActiveMedia,
    activeMedia,
    onEditDescription,
    isPending,
    errors,
    onDescription,
    onHtmlDescription,
    onJsonDescription,
    editor,
    onSetDeleteMedia,
  } = useGroupAbout(
    group?.description!,
    group?.htmlDescription!,
    group?.jsonDescription!,
    group?.id!,
    group?.gallery[0]!,
  )

  if (!group) {
    return (
      <div>
        <NoResult />
      </div>
    )
  }

  const isOwner: boolean = userId === group.userId

  return (
    <div className="flex flex-col gap-y-10">
      <div>
        <h2 className=" font-bold text-[56px] leading-none md:leading-normal">
          {group.name}
        </h2>
      </div>
      {group.gallery.length > 0 && (
        <div className="relative rounded-xl">
          {activeMedia?.type === "IMAGE" ? (
            <img
              src={`https://ucarecdn.com/${activeMedia?.url}/`}
              alt="group-img"
              className="w-full aspect-video z-20 rounded-t-xl object-cover object-center"
            />
          ) : activeMedia?.type === "LOOM" ? (
            <div className="w-full aspect-video">
              <iframe
                src={activeMedia.url}
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full outline-none border-0 rounded-t-xl"
              ></iframe>
            </div>
          ) : (
            activeMedia?.type === "YOUTUBE" && (
              <div className="w-full aspect-video">
                <iframe
                  src={activeMedia.url}
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full outline-none border-0 rounded-t-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture web-share"
                ></iframe>
              </div>
            )
          )}
        </div>
      )}
      <MediaGallery
        gallery={group.gallery}
        groupId={group.id}
        onActive={onSetActiveMedia}
        userId={userId}
        groupOwnerId={group.userId}
        onDeleteMedia={onSetDeleteMedia}
      />

      {!isOwner ? (
        <HTMLparser html={group.htmlDescription || ""} />
      ) : (
        <form
          ref={editor}
          onSubmit={onUpdateDescription}
          className="mt-5 flex flex-col "
        >
          <BlockTextEditor
            onEdit={onEditDescription}
            max={10000}
            inline
            min={100}
            disabled={isOwner ? false : true}
            name="jsondescription"
            errors={errors}
            setContent={setOnJsonDescription}
            content={onJsonDescription}
            htmlContent={group.htmlDescription as string | undefined}
            setHtmlContent={setOnHtmlDescription}
            textContent={onDescription}
            setTextContent={setOnDescription}
          />
          {onEditDescription && (
            <Button
              className="self-end bg-themeBlack border-themeGray px-10"
              variant={"outline"}
              disabled={isPending}
              type="submit"
            >
              <Loader loading={isPending}>Update</Loader>
            </Button>
          )}
        </form>
      )}
    </div>
  )
}

export default AboutGroup
