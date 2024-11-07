"use client"

import { useAppSelector } from "@/redux/store"
import dynamic from "next/dynamic"
import ExploreSlider from "./explore-slider"
import GroupList from "./group-list"

type Props = {
  layout: "SLIDER" | "LIST"
  category?: string
}

const SearchGroups = dynamic(
  () => import("./searched-groups").then((component) => component.SearchGroups),
  { ssr: false },
)

const ExplorePageContent = ({ layout, category }: Props) => {
  const { isSearching, data, status, debounce } = useAppSelector(
    (state) => state.search,
  )

  console.log("DATA", data)
  return (
    <div className="flex flex-col">
      {(isSearching || debounce) && status ? (
        <>
          <SearchGroups
            searching={isSearching as boolean}
            data={data as any}
            query={debounce}
          />
        </>
      ) : (
        status !== 200 &&
        (layout === "SLIDER" ? (
          <>
            <ExploreSlider
              label="Personal Development"
              text="Join top performing personal-development groups"
              query="personal-development"
            />
            <ExploreSlider
              label="Fitness"
              text="Join top performing fitness groups"
              query="fitness"
            />
            <ExploreSlider
              label="Lifestyle"
              text="Join top performing lifestyle groups"
              query="lifestyle"
            />
            <ExploreSlider
              label="music"
              text="Join top performing music groups"
              query="music"
            />
          </>
        ) : (
          <GroupList category={category as string} />
        ))
      )}
    </div>
  )
}

export default ExplorePageContent
