"use client"

import { useInfiniteScroll } from "@/hooks/infinite-scroll"
import MySkeleton from "../skeleton"

type Props = {
  mode: "GROUPS" | "POSTS"
  children: React.ReactNode
  identifier: string
  paginate?: number
  search?: boolean
  loading?: "POST"
}

const InfiniteScrollObserver = ({
  mode,
  children,
  identifier,
  paginate,
  search,
  loading,
}: Props) => {
  const { observerElement, isFetching } = useInfiniteScroll(
    mode,
    identifier,
    paginate || 0,
    search,
  )
  return (
    <>
      {children}
      <div ref={observerElement}>
        {isFetching && <MySkeleton element={loading || "CARD"} />}
      </div>
    </>
  )
}

export default InfiniteScrollObserver
