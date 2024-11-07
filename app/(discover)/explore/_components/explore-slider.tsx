import { useExploreSlider, useGroupList } from "@/hooks/groups"
import { useAppSelector } from "@/redux/store"
import React from "react"

type Props = {
  query: string
  label: string
  text: string
}

const ExploreSlider = ({ query, label, text }: Props) => {
  const { groups, status } = useGroupList(query)
  const {
    refetch,
    isFetching,
    data: fetchedData,
    onLoadSlider,
  } = useExploreSlider(query, groups && groups.length)

  const { data } = useAppSelector((state) => state.infiniteScroll)

  return (
    status === 200 &&
    groups &&
    groups.length &&
    onLoadSlider && (
      <div className="flex flex-col mt-16">
        <div className="flex flex-col px-[40px] lg:px-[150px]">
          <h2 className="text-2xl font-bold text-white">{label}</h2>
          <p className=" text-sm text-themeTextGray">{text}</p>
        </div>
        {/* <Slider/> */}
      </div>
    )
  )
}

export default ExploreSlider
