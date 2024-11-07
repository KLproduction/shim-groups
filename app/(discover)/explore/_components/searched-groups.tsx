import { Loader } from "@/components/global/loader"
import { GroupStateProps } from "@/redux/slices/search-slice"
import React from "react"
import GroupCard from "./group-card"
import NoResult from "@/components/global/search/no-result"
import InfiniteScrollObserver from "@/components/global/infinite-scroll-observer"
import PaginatedGroups from "./paginated-groups"

type Props = {
  searching: boolean
  data?: GroupStateProps[]
  query?: string
}

export const SearchGroups = ({ searching, data, query }: Props) => {
  return (
    <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6 mt-36">
      <Loader loading={searching} className="lg:col-span-3 md:col-span-2">
        {data?.length! > 0 ? (
          data?.map((group: any) => <GroupCard key={group.id} {...group} />)
        ) : (
          <NoResult />
        )}
      </Loader>
      {data?.length! > 5 && (
        <InfiniteScrollObserver
          mode="GROUPS"
          identifier={query as string}
          paginate={data?.length}
          search
        >
          <PaginatedGroups />
        </InfiniteScrollObserver>
      )}
    </div>
  )
}
