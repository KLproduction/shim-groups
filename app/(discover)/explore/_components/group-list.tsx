import { useGroupList } from "@/hooks/groups"
import React from "react"
import GroupCard from "./group-card"
import NoResult from "@/components/global/search/no-result"
import InfiniteScrollObserver from "@/components/global/infinite-scroll-observer"
import PaginatedGroups from "./paginated-groups"

type Props = {
  //   id: string
  //   name: string
  //   createdAt: Date
  //   htmlDescription: string
  //   userId: string
  //   thumbnail: string
  //   description: string
  //   privacy: "PUBLIC" | "PRIVATE"
  //   jsonDescription: string
  //   gallery: string[]
  category: string
}

const GroupList = ({ category }: Props) => {
  const { groups, status } = useGroupList("groups")
  return (
    <div className="container grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-6 mt-36">
      {status === 200 ? (
        groups.map((group: any) => <GroupCard key={group.id} {...group} />)
      ) : (
        <NoResult />
      )}
      {groups && groups.length > 5 && (
        <InfiniteScrollObserver
          mode="GROUPS"
          identifier={category}
          paginate={groups.length}
        >
          <PaginatedGroups />
        </InfiniteScrollObserver>
      )}
    </div>
  )
}

export default GroupList
