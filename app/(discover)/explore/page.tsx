import { onGetExploreGroups } from "@/data/groups"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import React from "react"
import ExplorePageContent from "./_components/explore-content"

type Props = {}

const ExplorePage = async (props: Props) => {
  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ["fitness"],
    queryFn: () => {
      return onGetExploreGroups("fitness", 0)
    },
  })
  await query.prefetchQuery({
    queryKey: ["music"],
    queryFn: () => {
      return onGetExploreGroups("music", 0)
    },
  })
  await query.prefetchQuery({
    queryKey: ["lifestyle"],
    queryFn: () => {
      return onGetExploreGroups("lifestyle", 0)
    },
  })
  await query.prefetchQuery({
    queryKey: ["personal-development"],
    queryFn: () => {
      return onGetExploreGroups("personal-development", 0)
    },
  })
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <ExplorePageContent layout={"SLIDER"} />
    </HydrationBoundary>
  )
}

export default ExplorePage
