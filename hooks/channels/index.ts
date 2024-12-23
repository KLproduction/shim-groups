import { onDeleteChannel, onUpdateChannelInfo } from "@/actions/channels"
import { CreateCommentSchema } from "@/components/forms/post-comment-form/schema"
import { CreateChannelPost } from "@/components/global/post-content/schema"
import {
  onCreateChannelPost,
  onCreateCommentReply,
  onCreateNewComment,
  onGetChannelInfo,
  onLikeChannelPost,
} from "@/data/channels"
import { onGetSectionInfo, onUpdateSection } from "@/data/course"
import { onGetPostComments, onGetPostInfo } from "@/data/groups"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { JSONContent } from "novel"
import { comment } from "postcss"
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

  const [onHtmlDescription, setOnHtmlDescription] = useState<string>("")

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

export const useSectionNavBar = (sectionId: string, courseId: string) => {
  const { data } = useQuery({
    queryKey: ["section-info", sectionId],
    queryFn: () => onGetSectionInfo(sectionId),
  })

  const query = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: () => onUpdateSection(sectionId, "COMPLETE", ""),
    onSuccess: (data) => {
      return data?.status !== 200
        ? toast.error(data?.message)
        : toast.success(data?.message)
    },
    onSettled: async () => {
      await query.invalidateQueries({
        queryKey: ["section-info", sectionId],
      })
      await query.invalidateQueries({
        queryKey: ["course-modules", courseId],
      })
    },
  })
  return { data, isPending, mutate }
}

export const useGetPost = (postId: string) => {
  const { data } = useQuery({
    queryKey: ["unique-post", postId],
    queryFn: () => onGetPostInfo(postId),
  })

  return { data }
}

export const usePostComment = (postId: string) => {
  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof CreateCommentSchema>
  >({
    resolver: zodResolver(CreateCommentSchema),
  })
  const query = useQueryClient()
  const { mutate, variables, isPending } = useMutation({
    mutationFn: (data: { content: string; commentId: string }) =>
      onCreateNewComment(postId, data.content, data.commentId),
    onMutate: () => reset(),
    onSuccess: (data) => {
      return data.status !== 200
        ? toast.error(data.message)
        : toast.success(data.message)
    },
    onSettled: async () => {
      await query.invalidateQueries({
        queryKey: ["unique-post", postId],
      })
      await query.invalidateQueries({
        queryKey: ["post-comments", postId],
      })
    },
  })

  const onCreateComment = handleSubmit(async (values) =>
    mutate({
      content: values.comment,
      commentId: v4(),
    }),
  )

  return {
    register,
    variables,
    isPending,
    onCreateComment,
  }
}

export const useComments = (postId: string) => {
  const { data } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: () => onGetPostComments(postId),
  })

  return { data }
}

export const useReply = () => {
  const [onReply, setOnReply] = useState<{
    comment?: string
    reply: boolean
  }>({ comment: undefined, reply: false })
  const [activeComment, setActiveComment] = useState<string | undefined>(
    undefined,
  )

  const onSetReply = (commentId: string) =>
    setOnReply((prev) => ({ ...prev, commentId, reply: true }))
  const onSetActiveComment = (commentId: string) => setActiveComment(commentId)
  return {
    onReply,
    onSetReply,
    onSetActiveComment,
    activeComment,
  }
}

export const usePostReply = (commentId: string, postId: string) => {
  const { register, reset, handleSubmit } = useForm<
    z.infer<typeof CreateCommentSchema>
  >({
    resolver: zodResolver(CreateCommentSchema),
  })
  const { mutate, variables, isPending } = useMutation({
    mutationFn: (data: { content: string; commentId: string }) =>
      onCreateCommentReply(
        postId,
        data.content,
        data.commentId,
        data.commentId,
      ),
    onMutate: () => reset(),
    onSuccess: (data) => {
      return data?.status !== 200
        ? toast.error(data?.message)
        : toast.success(data.message)
    },
  })

  const onCreateReply = handleSubmit(async (values) => {
    mutate({
      content: values.comment,
      commentId: commentId,
    })
  })
  return {
    onCreateReply,
    register,
    variables,
    isPending,
  }
}
