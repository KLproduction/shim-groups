"use client"

import { onGetUserGroups } from "@/data/groups"
import { onAuthenticatedUser } from "@/data/user"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"

type Props = {}

const Page = (props: Props) => {
    // Step 1: Get the authenticated user
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await onAuthenticatedUser()
                if (user && user.id) {
                    setUserId(user.id)
                }
            } catch (error) {
                console.error("Error fetching authenticated user:", error)
            }
        }

        fetchUser()
    }, [])

    // Step 2: Use `useQuery` to fetch user groups when userId is available
    const { data, isLoading, isError } = useQuery({
        queryKey: userId ? ["user-groups", userId] : [], // Provide a valid queryKey when userId is available
        queryFn: async () => {
            if (!userId) return null // Return null if no userId is present, to prevent the query from running
            return await onGetUserGroups(userId)
        },
        enabled: !!userId, // Ensure the query only runs if userId is available
    })

    // Step 3: Conditionally render based on the query states
    if (isLoading) {
        return <div>Loading...</div> // Show loading state while fetching
    }

    if (isError) {
        return <div>Error fetching data. Please try again later.</div> // Show error state if the query fails
    }

    if (data?.status === 404) {
        return <div>No groups found for this user.</div> // Handle case when data is not found
    }

    return (
        <div>
            <h1>Page</h1>
            <div>
                <h2>User Groups:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>{" "}
                {/* Render fetched data */}
            </div>
        </div>
    )
}

export default Page
