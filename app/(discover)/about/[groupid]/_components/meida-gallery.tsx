import MediaGalleryForm from "@/components/forms/meida-gallery"
import GlassModal from "@/components/global/glass-modal"
import { Card, CardContent } from "@/components/ui/card"
import { BadgePlus } from "@/icons"
import { validateURLString } from "@/lib/utils"
import { LucideDelete, Trash } from "lucide-react"
import React from "react"

type Props = {
  gallery: string[]
  groupId: string
  onActive(media: { url: string | undefined; type: string }): void
  userId: string
  groupOwnerId: string
  onDeleteMedia(gallery: string): void
}

const MediaGallery = ({
  gallery,
  groupId,
  onActive,
  userId,
  groupOwnerId,
  onDeleteMedia,
}: Props) => {
  const isOwner = userId === groupOwnerId
  return (
    <div className="flex justify-start gap-3 flex-wrap">
      {gallery.length > 0 &&
        gallery.map((gal, index) => {
          const mediaType = validateURLString(gal)
          return mediaType.type === "IMAGE" ? (
            <div key={index} className="relative">
              <img
                onClick={() => onActive({ url: gal, type: "IMAGE" })}
                src={`https://ucarecdn.com/${gal}/`}
                alt="gallery-img"
                className="aspect-video w-36 h-36 object-cover cursor-pointer rounded-xl opacity-80 hover:opacity-70 "
              />
              {isOwner && (
                <div
                  className="text-red-500 bg-zinc-200 rounded-full p-1 absolute -top-1 -right-1 z-50 text-xs hover:transition-all hover:scale-150 cursor-pointer"
                  onClick={() => onDeleteMedia(gal)}
                >
                  <Trash height={15} width={15} />
                </div>
              )}
            </div>
          ) : mediaType.type === "LOOM" ? (
            <div className="relative" key={index}>
              <div
                onClick={() => onActive({ url: gal, type: "LOOM" })}
                className="relative w-36 h-36 rounded-xl cursor-pointer"
              >
                <iframe
                  src={gal}
                  className="absolute outline-none border-0 top-0 left-0 w-full h-full rounded-xl pointer-events-none"
                />
              </div>
              {isOwner && (
                <div
                  className="text-red-500 bg-zinc-200 rounded-full p-1 absolute -top-1 -right-1 z-50 text-xs hover:transition-all hover:scale-150 cursor-pointer"
                  onClick={() => onDeleteMedia(gal)}
                >
                  <Trash height={15} width={15} />
                </div>
              )}
            </div>
          ) : (
            <div className="relative" key={index}>
              <div
                key={index}
                onClick={() => onActive({ url: gal, type: "YOUTUBE" })}
                className="relative w-36 h-36 rounded-xl cursor-pointer z-50 hover:border-2 hover:border-white"
              >
                <iframe
                  src={gal}
                  className="absolute outline-none border-0 top-0 left-0 w-full h-full rounded-xl pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              {isOwner && (
                <div
                  className="text-red-500 bg-zinc-200 rounded-full p-1 absolute -top-1 -right-1 z-50 text-xs hover:transition-all hover:scale-150 cursor-pointer"
                  onClick={() => onDeleteMedia(gal)}
                >
                  <Trash height={15} width={15} />
                </div>
              )}
            </div>
          )
        })}
      {isOwner && (
        <GlassModal
          title="Add media to VSL"
          description="Paste a link to a youtube or loom video."
          trigger={
            <Card className="border-dashed border-themeGray hover:bg-themeBlack bg-transparent cursor-pointer">
              <CardContent className="flex justify-center items-center py-10 px-16">
                <BadgePlus />
              </CardContent>
            </Card>
          }
        >
          <MediaGalleryForm groupId={groupId} />
        </GlassModal>
      )}
    </div>
  )
}

export default MediaGallery
