"use client"

import {
  onDeleteGallery,
  onGetAllGroupMembers,
  onGetExploreGroups,
  onGetGroupChannels,
  onGetGroupInfo,
  onJoinGroup,
  onSearchGroups,
  onUpdateGallery,
  onUpDateGroupSettings,
} from "@/data/groups"
import { onSearchPosts } from "@/data/posts"
import { supabaseClient, validateURLString } from "@/lib/utils"
import { onOnline } from "@/redux/slices/online-member-slice"
import { onPostSearch, PostStateProps } from "@/redux/slices/posts-search-slice"
import {
  GroupStateProps,
  onClearSearch,
  onSearch,
} from "@/redux/slices/search-slice"
import { AppDispatch } from "@/redux/store"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { JSONContent } from "novel"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { GroupSettingsSchema } from "@/components/forms/group-settings/schema"
import { on } from "events"
import { toast } from "sonner"
import { upload } from "@/lib/uploadcare"
import { usePathname, useRouter } from "next/navigation"
import { getUserById } from "@/data/user"
import {
  onClearList,
  onInfiniteScroll,
} from "@/redux/slices/infinite-scroll-slice"
import { group } from "console"
import { UpdateGallerySchema } from "@/components/forms/meida-gallery/schema"
import { onGetActiveSubscriptions } from "@/data/payments"

export const useGroupChatOnline = (userId: string) => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const setupTracking = async () => {
      const userDetails = await getUserById(userId)

      if (!userDetails) {
        console.error("User not found.")
        return
      }

      const channel = supabaseClient.channel("tracking")

      channel
        .on("presence", { event: "sync" }, () => {
          const state: any = channel.presenceState()

          for (const user in state) {
            dispatch(
              onOnline({
                members: [
                  {
                    id: state[user][0].member.userId,
                    userName: state[user][0].member.userName,
                  },
                ],
              }),
            )
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              member: {
                userId,
                userName: userDetails.name as string,
              },
            })
          }
        })

      return () => {
        channel.unsubscribe()
      }
    }

    setupTracking()
  }, [])
}

export const useSearch = (search: "GROUPS" | "POSTS") => {
  const [query, setQuery] = useState("")
  const [debounce, setDebounce] = useState("")
  const queryClient = new QueryClient()
  const dispatch: AppDispatch = useDispatch()

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    const delayInputTimeout = setTimeout(() => {
      setDebounce(query)
    }, 1000)

    return () => clearTimeout(delayInputTimeout)
  }, [query, 1000])

  const { refetch, data, isFetched, isFetching } = useQuery({
    queryKey: [["search-data"], debounce],
    queryFn: async ({ queryKey }) => {
      if (search === "GROUPS") {
        const groups = await onSearchGroups(search, queryKey[1] as string)
        return { type: "GROUPS", data: groups, status: groups?.status }
      }
      if (search === "POSTS") {
        const posts = await onSearchPosts(search, queryKey[1] as string)
        return { type: "POSTS", data: posts, status: posts?.status }
      }
      return { type: "UNKNOWN", data: [], status: 404 }
    },
    enabled: false,
  })
  const [hasFetched, setHasFetched] = useState(false)
  useEffect(() => {
    if (isFetching) {
      if (data?.type === "GROUPS") {
        dispatch(
          onSearch({
            isSearching: true,
            data: (data.data as GroupStateProps[]) || [],
          }),
        )
      } else if (data?.type === "POSTS") {
        dispatch(
          onPostSearch({
            isSearching: true,
            data: (data.data as PostStateProps[]) || [],
          }),
        )
      }
    }

    if (isFetched) {
      if (data?.type === "GROUPS") {
        dispatch(
          onSearch({
            isSearching: false,
            status: data?.status as number,
            data: (data.data as GroupStateProps[]) || [],
            debounce,
          }),
        )
      } else if (data?.type === "POSTS") {
        dispatch(
          onPostSearch({
            isSearching: false,
            status: data?.status as number,
            data: (data.data as PostStateProps[]) || [],
            debounce,
          }),
        )
      }
    }
    setHasFetched(true)
  }, [isFetching, isFetched, data, dispatch, debounce])

  useEffect(() => {
    if (debounce) {
      refetch()
      setHasFetched(false)
    } else {
      dispatch(onClearSearch())
    }
  }, [debounce, refetch, dispatch])

  return { query, onSearchQuery }
}

export const useGroupSettings = (groupId: string) => {
  const query = new QueryClient()

  const { data } = useQuery({
    queryKey: ["group-info", groupId],
    queryFn: () => onGetGroupInfo(groupId),
  })

  let parsedJsonDescription

  if (data?.group?.jsonDescription) {
    parsedJsonDescription = JSON.parse(data?.group?.jsonDescription as string)
  } else {
    parsedJsonDescription = undefined
  }

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(parsedJsonDescription)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    data?.group?.description || undefined,
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof GroupSettingsSchema>>({
    resolver: zodResolver(GroupSettingsSchema),
    mode: "onChange",
  })

  const [preViewIcon, setPreviewIcon] = useState<string | undefined>(undefined)
  const [preViewThumbnail, setPreviewThumbnail] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const previews = watch(({ icon, thumbnail }) => {
      if (icon && icon[0]) {
        setPreviewIcon(URL.createObjectURL(icon[0]))
      }
      if (thumbnail && thumbnail[0]) {
        setPreviewThumbnail(URL.createObjectURL(thumbnail[0]))
      }
    })
    return () => previews.unsubscribe()
  }, [watch])

  const onSetDescription = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsondescription", JsonContent)
    setValue("description", onDescription)
  }

  useEffect(() => {
    onSetDescription()
  }, [onJsonDescription, onDescription])

  const { mutate: update, isPending } = useMutation({
    mutationKey: ["group-settings"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      if (values.thumbnail && values.thumbnail.length > 0) {
        const uploaded = await upload.uploadFile(values.thumbnail[0])
        const updated = await onUpDateGroupSettings(
          groupId,
          "IMAGE",
          uploaded.uuid,
          `/group/${groupId}/settings`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty")
        }
      }
      if (values.icon && values.icon.length > 0) {
        const uploaded = await upload.uploadFile(values.icon[0])
        const updated = await onUpDateGroupSettings(
          groupId,
          "ICON",
          uploaded.uuid,
          `/group/${groupId}/settings`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty")
        }
      }
      if (values.name) {
        const updated = await onUpDateGroupSettings(
          groupId,
          "NAME",
          values.name,
          `/group/${groupId}/settings`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty")
        }
      }
      if (values.description) {
        const updated = await onUpDateGroupSettings(
          groupId,
          "DESCRIPTION",
          values.description,
          `/group/${groupId}/settings`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty")
        }
      }
      if (values.jsondescription) {
        const updated = await onUpDateGroupSettings(
          groupId,
          "JSONDESCRIPTION",
          values.jsondescription,
          `/group/${groupId}/settings`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty")
        }
      }
      if (values.htmldescription) {
        const updated = await onUpDateGroupSettings(
          groupId,
          "HTMLDESCRIPTION",
          values.htmldescription,
          `/group/${groupId}/settings`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty")
        }
      }
      if (
        !values.thumbnail &&
        !values.icon &&
        !values.name &&
        !values.description &&
        !values.jsondescription &&
        !values.htmldescription
      ) {
        return toast.error("Oops! looks like your form is empty")
      }
      return toast.success("Group data updated ")
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["group-info", groupId] })
    },
  })

  const route = useRouter()

  const onUpdate = handleSubmit(async (values) => {
    update(values)
    if (data?.status !== 200) {
      route.push(`/group/${groupId}`)
    }
  })

  return {
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
  }
}

export const useGroupList = (query: string) => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["groups", query],
    queryFn: async () => await onGetExploreGroups(query, 0),
  })

  const dispatch: AppDispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(onClearList({ data: [] }))
  }, [])

  const { groups, status } = (data || { groups: [], status: 404 }) as {
    groups: GroupStateProps[]
    status: number
  }
  console.log({ groups, status })
  return {
    groups,
    status,
    isFetching,
    isFetched,
  }
}

export const useExploreSlider = (query: string, paginate: number) => {
  const [onLoadSlider, setOnLoadSlider] = useState(false)
  const dispatch: AppDispatch = useDispatch()
  const { data, refetch, isFetching, isFetched } = useQuery({
    queryKey: ["fetch-group-slides", query],
    queryFn: () => onGetExploreGroups(query, paginate || 0),
    enabled: false,
  })

  useEffect(() => {
    if (isFetched && data?.status === 200 && data.groups) {
      dispatch(
        onInfiniteScroll({
          data: data.groups,
        }),
      )
    }
  }, [isFetched, data, dispatch])

  useEffect(() => {
    setOnLoadSlider(true)
  }, [])

  return { refetch, isFetching, data, onLoadSlider }
}

export const useGroupInfo = (groupId: string) => {
  const { data } = useQuery({
    queryKey: ["about-group-info", groupId],
  })

  const route = useRouter()
  const { group, status, message } = data as {
    status: number
    group: GroupStateProps
    message: string
  }

  if (status !== 200) {
    toast.error(message)
    route.push("/explore")
  }

  return group
}

export const useGroupAbout = (
  description: string | null,
  htmlDescription: string | null,
  jsonDescription: string | null,
  groupId: string,
  currentMedia: string,
) => {
  const editor = useRef<HTMLFormElement | null>(null)
  const route = useRouter()
  const mediaType = validateURLString(currentMedia)
  const [activeMedia, setActiveMedia] = useState<
    { url: string | undefined; type: string } | undefined
  >(
    mediaType.type === "IMAGE"
      ? { url: currentMedia, type: mediaType.type }
      : { ...mediaType },
  )

  const jsonContent =
    jsonDescription !== null
      ? JSON.parse(jsonDescription)
      : { type: "doc", content: [] }
  const [onJsonDescription, setOnJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent)
  const [onDescription, setOnDescription] = useState<string | undefined>(
    description || undefined,
  )
  const [onHtmlDescription, setOnHtmlDescription] = useState<string>(
    htmlDescription || "",
  )
  const [onEditDescription, setOnEditDescription] = useState<boolean>(false)

  const {
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm()

  const onSetDescription = () => {
    setValue("description", onDescription)
    setValue("htmldescription", onHtmlDescription)
    setValue("jsondescription", onJsonDescription)
  }

  useEffect(() => {
    onSetDescription()
  }, [onJsonDescription, onDescription, onHtmlDescription])

  const onEditTextEditor = (event: Event) => {
    if (editor.current && editor.current.contains(event.target as Node)) {
      setOnEditDescription(true)
    }
  }
  useEffect(() => {
    document.addEventListener("click", onEditTextEditor, false)
    return () => {
      document.removeEventListener("click", onEditTextEditor, false)
    }
  }, [])

  const { mutate, isPending } = useMutation({
    mutationKey: ["about-description"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      if (values.description) {
        const updated = await onUpDateGroupSettings(
          groupId,
          "DESCRIPTION",
          values.description,
          `/about/${groupId}`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty1")
        }
      }
      if (values.jsondescription) {
        const updated = await onUpDateGroupSettings(
          groupId,
          "JSONDESCRIPTION",
          JSON.stringify(values.jsondescription),
          `/about/${groupId}`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty2")
        }
      }
      if (values.htmldescription) {
        const updated = await onUpDateGroupSettings(
          groupId,
          "HTMLDESCRIPTION",
          values.htmldescription,
          `/about/${groupId}`,
        )
        if (updated.status !== 200) {
          return toast.error("Oops! looks like your form is empty3")
        }
      }
      if (
        !values.description &&
        !values.jsondescription &&
        !values.htmldescription
      ) {
        return toast.error("Oops! looks like your form is empty4")
      }
      return toast.success("Group data updated ")
    },
  })

  const onSetActiveMedia = (media: { url: string; type: string }) => {
    setActiveMedia(media)
  }

  const onUpdateDescription = handleSubmit(async (values) => {
    mutate(values)
    setOnEditDescription(false)
  })

  const { mutate: deleteMutate, isPending: deleteIsPending } = useMutation({
    mutationFn: async (data: string) => onDeleteGallery(groupId, data),
    onSuccess: (result) => {
      if (result?.status === 200) {
        route.refresh()
        return toast.success(result.message)
      }
      return toast.error(result?.message)
    },
    onError: (error) => {
      console.error("Error occurred:", error)
      toast.error("An error occurred while deleting the gallery.")
    },
    onSettled: (result) => {
      console.log("Mutation settled:", result)
    },
  })

  const onSetDeleteMedia = (galleryId: string) => {
    deleteMutate(galleryId)
  }

  return {
    setOnDescription,
    setOnHtmlDescription,
    setOnJsonDescription,
    onSetDescription,
    onUpdateDescription,
    onSetActiveMedia,
    onSetDeleteMedia,
    deleteMutate,
    activeMedia,
    onEditDescription,
    isPending,
    errors,
    onDescription,
    onHtmlDescription,
    onJsonDescription,
    editor,
  }
}

export const useMediaGallery = (groupId: string) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<z.infer<typeof UpdateGallerySchema>>({
    resolver: zodResolver(UpdateGallerySchema),
  })
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-gallery"],
    mutationFn: async (values: z.infer<typeof UpdateGallerySchema>) => {
      if (values.videoUrl) {
        const update = await onUpdateGallery(groupId, values.videoUrl)

        if (update && update.status !== 200) {
          toast.error(update.message)
        }
      }
      if (values.image && values.image.length) {
        let count = 0
        while (count < values.image.length) {
          const uploaded = await upload.uploadFile(values.image[count])
          if (uploaded) {
            const update = await onUpdateGallery(groupId, uploaded.uuid)
            if (update.status !== 200) {
              toast.error(update.message)
              break
            }
          } else {
            toast.error("Looks like something went wrong!")
            break
          }
          count++
        }
      }

      return toast.success("Group data updated ")
    },
  })
  const onHandleUpdateGallery = handleSubmit(async (values) => mutate(values))
  return {
    register,
    errors,
    onHandleUpdateGallery,
    isPending,
    setValue,
  }
}

export const useActiveGroupSubscription = (groupId: string) => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["active-subscription"],
    queryFn: () => onGetActiveSubscriptions(groupId),
  })

  return { data, isFetched, isFetching }
}

export const useJoinFree = (groupId: string) => {
  const route = useRouter()
  const onJoinFreeGroup = async () => {
    const member = await onJoinGroup(groupId)
    if (member.status === 200) {
      const channels = await onGetGroupChannels(groupId)
      if (channels && channels.channels && channels.status === 200) {
        route.push(`/group/${groupId}/channel/${channels?.channels[0].id}`)
      }
    }
  }
  return { onJoinFreeGroup }
}

export const useGroupChat = (groupId: string) => {
  const { data } = useQuery({
    queryKey: ["member-chat", groupId],
    queryFn: () => onGetAllGroupMembers(groupId),
  })

  const pathname = usePathname()

  return { data, pathname }
}
