import { onDeleteChannel, onUpdateChannelInfo } from "@/actions/channels"
import { CreateChannelPost } from "@/components/global/post-content/schema"
import {
  onCreateChannelPost,
  onGetChannelInfo,
  onLikeChannelPost,
} from "@/data/channels"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { JSONContent } from "novel"
import { use, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 } from "uuid"
import { z } from "zod"

export const useChannelInfo = () => {
  const channelRef = useRef<HTMLAnchorElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [channel, setChannel] = useState<string | undefined>(undefined)
  const [edit, setEdit] = useState<boolean>(false)
  const [icon, setIcon] = useState<string | undefined>(undefined)
  const query = useQueryClient()
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const onEditChannel = (id: string | undefined) => {
    setChannel(id)
    setEdit(true)
  }
  const onSetIcon = (icon: string | undefined) => {
    setIcon(icon)
  }

  const { isPending, mutate, variables } = useMutation({
    mutationFn: (data: { name?: string; icon?: string }) => {
      return onUpdateChannelInfo(channel!, data.name, data.icon)
    },
    onMutate: () => {
      setEdit(false)
      onSetIcon(undefined)
    },
    onSuccess: (data) => {
      return data.status !== 200
        ? toast.error(data.message)
        : toast.success(data.message)
    },

    onSettled: async () => {
      return await query.invalidateQueries({
        queryKey: ["group-channels"],
      })
    },
  })

  const { variables: deleteVariables, mutate: deleteMutation } = useMutation({
    mutationFn: (data: { id: string }) => onDeleteChannel(data.id),

    onSuccess: (data) => {
      return data.status !== 200
        ? toast.error(data.message)
        : toast.success(data.message)
    },
    onSettled: async () => {
      return await query.refetchQueries({
        queryKey: ["group-channels"],
      })
    },
  })

  const onEndChannelEdit = (event: Event) => {
    if (edit) {
      const target = event.target as Node | null

      if (
        inputRef.current &&
        channelRef.current &&
        !inputRef.current.contains(target) &&
        !channelRef.current.contains(target) &&
        (!triggerRef.current || !triggerRef.current.contains(target))
      ) {
        if (inputRef.current.value) {
          mutate({ name: inputRef.current.value })
        } else {
          setEdit(false)
        }
      }
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (edit && event.key === "Enter") {
      if (inputRef.current?.value) {
        mutate({ name: inputRef.current.value })
      } else {
        setEdit(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", onEndChannelEdit, true)
    inputRef.current?.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onEndChannelEdit, true)
      inputRef.current?.removeEventListener("keydown", onKeyDown)
    }
  }, [icon, edit])

  const onChannelDelete = (id: string) => {
    deleteMutation({ id })
  }

  return {
    channel,
    onEditChannel,
    channelRef,
    edit,
    inputRef,
    variables,
    isPending,
    triggerRef,
    onSetIcon,
    icon,
    onChannelDelete,
    deleteVariables,
  }
}

export const useCreateChannelPost = (channelid: string) => {
  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(undefined)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    undefined,
  )

  const [onHtmlDescription, setOnHtmlDescription] = useState<string | "">("")

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<z.infer<typeof CreateChannelPost>>({
    resolver: zodResolver(CreateChannelPost),
  })

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsoncontent", JsonContent)
    setValue("content", onDescription)
    setValue("htmlcontent", onHtmlDescription)
  }

  useEffect(() => {
    onSetDescriptions()
    return () => {
      onSetDescriptions()
    }
  }, [onJsonDescription, onDescription])

  const client = useQueryClient()

  const { mutate, variables, isPending } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: (data: {
      title: string
      content: string
      htmlcontent: string
      jsoncontent: string
      postid: string
    }) =>
      onCreateChannelPost(
        channelid,
        data.title,
        data.content,
        data.htmlcontent,
        data.jsoncontent,
        data.postid,
      ),
    onSuccess: (data) => {
      setJsonDescription(undefined)
      setOnHtmlDescription("")
      setOnDescription(undefined)
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      })
    },
    onSettled: async () => {
      await client.invalidateQueries({
        queryKey: ["channel-info"],
      })
      await client.invalidateQueries({
        queryKey: ["scroll-posts", channelid],
      })
    },
  })

  const onCreatePost = handleSubmit(async (values) =>
    mutate({
      title: values.title,
      content: values.content!,
      htmlcontent: values.htmlcontent!,
      jsoncontent: values.jsoncontent!,
      postid: v4(),
    }),
  )

  return {
    onJsonDescription,
    onDescription,
    onHtmlDescription,
    setOnDescription,
    setOnHtmlDescription,
    setJsonDescription,
    register,
    errors,
    variables,
    isPending,
    onCreatePost,
  }
}

export const useChannelPage = (channelid: string) => {
  const { data } = useQuery({
    queryKey: ["channel-info"],
    queryFn: () => onGetChannelInfo(channelid),
  })

  const mutation = useMutationState({
    filters: { mutationKey: ["create-post"], status: "pending" },
    select: (mutation) => {
      return {
        state: mutation.state.variables as any,
        status: mutation.state.status,
      }
    },
  })

  return { data, mutation }
}

export const useLikeChannelPost = (postid: string, channelId: string) => {
  const client = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (data: { likeid: string }) =>
      onLikeChannelPost(postid, data.likeid),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      })
    },
    onSettled: async () => {
      await client.invalidateQueries({
        queryKey: ["unique-post"],
      })
      await client.invalidateQueries({
        queryKey: ["channel-info"],
      })
      await client.invalidateQueries({
        queryKey: ["scroll-posts"],
      })
    },
  })

  return { mutate, isPending }
}
