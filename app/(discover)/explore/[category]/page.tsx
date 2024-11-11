"use client"

import { onGetExploreGroups } from "@/data/groups"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query"
import React from "react"
import ExplorePageContent from "../_components/explore-content"

const CategoryPage = async ({ params }: { params: { category: string } }) => {
  const query = new QueryClient()
  // await query.prefetchQuery({
  //   queryKey: ["groups"],
  //   queryFn: () => onGetExploreGroups(params.category, 0),

  // })

  return (
    // <HydrationBoundary state={dehydrate(query)}>
    <ExplorePageContent layout="LIST" category={params.category} />
    // </HydrationBoundary>
  )
}

export default CategoryPage
