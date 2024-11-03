"use client"

import { onSearchGroups } from "@/data/groups"
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
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export const useGroupChatOnline = (userId: string) => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const channel = supabaseClient.channel("tracking")

    channel
      .on("presence", { event: "sync" }, () => {
        const state: any = channel.presenceState()

        for (const user in state) {
          dispatch(
            onOnline({
              members: [{ id: state[user][0].member.userId }],
            }),
          )
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            member: {
              userId,
            },
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
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
  useEffect(() => {
    if (debounce) {
      refetch()
    } else {
      dispatch(onClearSearch())
    }
  }, [debounce, refetch, dispatch])

  return { query, onSearchQuery }
}
