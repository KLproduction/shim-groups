"use client"

import { useAppSelector } from "@/redux/store"
import dynamic from "next/dynamic"
import ExploreSlider from "./explore-slider"

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
  return (
    <div className="flex flex-col">
      {isSearching || debounce ? (
        <>
          <SearchGroups
            searching={isSearching as boolean}
            data={data}
            query={debounce}
          />
        </>
      ) : (
        status !== 200 &&
        (layout === "SLIDER" ? (
          <>
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
              label="Music"
              text="Join top performing music groups"
              query="music"
            />
          </>
        ) : (
          <></>
        ))
      )}
    </div>
  )
}

export default ExplorePageContent
