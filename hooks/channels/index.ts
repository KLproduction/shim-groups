import { onDeleteChannel, onUpdateChannelInfo } from "@/actions/channels"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { use, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

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
      // If the Enter key is pressed and we are in edit mode
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
