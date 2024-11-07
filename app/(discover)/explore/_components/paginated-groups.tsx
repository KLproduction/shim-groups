import { useAppSelector } from "@/redux/store"
import React from "react"
import GroupCard from "./group-card"

type Props = {}

const PaginatedGroups = (props: Props) => {
  const { data } = useAppSelector((state) => state.infiniteScroll)
  return data.map((data: any) => <GroupCard key={data.id} {...data} />)
}

export default PaginatedGroups
