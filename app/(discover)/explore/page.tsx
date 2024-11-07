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
      onGetExploreGroups("fitness", 0)
    },
  })
  await query.prefetchQuery({
    queryKey: ["music"],
    queryFn: () => {
      onGetExploreGroups("music", 0)
    },
  })
  await query.prefetchQuery({
    queryKey: ["lifestyle"],
    queryFn: () => {
      onGetExploreGroups("lifestyle", 0)
    },
  })
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <ExplorePageContent layout={"SLIDER"} />
    </HydrationBoundary>
  )
}

export default ExplorePage
