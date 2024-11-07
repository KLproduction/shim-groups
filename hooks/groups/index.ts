"use client"

import {
  onGetExploreGroups,
  onGetGroupInfo,
  onSearchGroups,
  onUpDateGroupSettings,
} from "@/data/groups"
import { onSearchPosts } from "@/data/posts"
import { supabaseClient } from "@/lib/utils"
import { onOnline } from "@/redux/slices/online-member-slice"
import { onPostSearch, PostStateProps } from "@/redux/slices/posts-search-slice"
import {
  GroupStateProps,
  onClearSearch,
  onSearch,
} from "@/redux/slices/search-slice"
import { AppDispatch } from "@/redux/store"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { JSONContent } from "novel"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { GroupSettingsSchema } from "@/components/forms/group-settings/schema"
import { on } from "events"
import { toast } from "sonner"
import { upload } from "@/lib/uploadcare"
import { useRouter } from "next/navigation"
import { getUserById } from "@/data/user"
import {
  onClearList,
  onInfiniteScroll,
} from "@/redux/slices/infinite-scroll-slice"

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
  }, [isFetching, isFetched, data, dispatch, debounce, hasFetched])

  useEffect(() => {
    if (debounce) {
      refetch()
      setHasFetched(false)
    } else {
      dispatch(onClearSearch())
      setHasFetched(false)
    }
  }, [debounce, refetch, dispatch])

  return { query, onSearchQuery }
}

export const useGroupSettings = (groupId: string) => {
  const { data } = useQuery({
    queryKey: ["group-info"],
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
  const { data } = useQuery({
    queryKey: [query],
  })

  const dispatch: AppDispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(onClearList({ data: [] }))
  }, [])

  const { groups, status } = (data || { groups: [], status: 404 }) as {
    groups: GroupStateProps[]
    status: number
  }
  return {
    groups,
    status,
  }
}

export const useExploreSlider = (query: string, paginate: number) => {
  const [onLoadSlider, setOnLoadSlider] = useState(false)
  const dispatch: AppDispatch = useDispatch()
  const { data, refetch, isFetching, isFetched } = useQuery({
    queryKey: ["fetch-group-slides"],
    queryFn: () => onGetExploreGroups(query, paginate | 0),
    enabled: false,
  })

  if (isFetched && data?.status === 200 && data.groups) {
    dispatch(
      onInfiniteScroll({
        data: data.groups,
      }),
    )
  }

  useEffect(() => {
    setOnLoadSlider(true)
  }, [])

  return { refetch, isFetching, data, onLoadSlider }
}
