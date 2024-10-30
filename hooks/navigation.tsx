"use client"

import { onCreateNewChannel } from "@/actions/channels"
import { IGroupInfo, IGroups } from "@/components/global/sidebar"
import { onGetGroupChannels } from "@/data/groups"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export const useNavigation = () => {
    const pathName = usePathname()

    const [section, setSection] = useState<string | undefined>(pathName)
    const onSetSection = (page: string) => setSection(page)

    return { section, onSetSection }
}

export const useSideBar = (groupId: string) => {
    const { data: groups } = useQuery({
        queryKey: ["user-groups"],
    }) as { data: IGroups }

    const { data: groupInfo } = useQuery({
        queryKey: ["group-info"],
    }) as { data: IGroupInfo }

    const { data: channels } = useQuery({
        queryKey: ["group-channels"],
        queryFn: () => onGetGroupChannels(groupId),
    })

    const query = useQueryClient()

    const { isPending, mutate, isError, variables } = useMutation({
        mutationFn: (data: {
            id: string
            name: string
            icon: string
            createdAt: Date
            groupId: string
        }) =>
            onCreateNewChannel(groupId, {
                id: data.id,
                name: data.name.toLowerCase(),
                icon: data.icon,
            }),
        onSettled: async () => {
            return await query.invalidateQueries({
                queryKey: ["group-channels"],
            })
        },
    })
    if (isPending) toast.success("Channel created successfully")
    if (isError) toast.error("Oops! Something went wrong")

    return {
        groups,
        groupInfo,
        mutate,
        variables,
        isPending,
        channels,
    }
}
