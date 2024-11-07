"use client"

import { Input } from "@/components/ui/input"
import { useSearch } from "@/hooks/groups"
import { cn } from "@/lib/utils"
import { RootState } from "@/redux/store"
import { SearchIcon } from "lucide-react"
import { useSelector } from "react-redux"
import SearchResults from "./SearchResult"

type Props = {
  className?: string
  inPutStyle?: string
  placeholder?: string
  searchType?: "GROUPS" | "POSTS"
  iconStyle?: string
  glass?: boolean
}

const Search = ({
  className,
  inPutStyle,
  placeholder,
  searchType,
  iconStyle,
  glass,
}: Props) => {
  const { query, onSearchQuery } = useSearch(searchType!)

  const searchState = useSelector((state: RootState) => {
    return searchType === "GROUPS" ? state.search : state.PostSearch
  })

  return (
    <>
      <div
        className={cn(
          "border-2 flex gap-2 items-center",
          className,
          glass &&
            "bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-20",
        )}
      >
        <SearchIcon className={cn(iconStyle || "text-themeTextGray")} />
        <Input
          onChange={onSearchQuery}
          value={query}
          placeholder={placeholder}
          type="text"
          className={cn("bg-transparent border-none ", inPutStyle)}
        />
      </div>
      {/* <SearchResults searchType={searchType!} /> */}
    </>
  )
}

export default Search
