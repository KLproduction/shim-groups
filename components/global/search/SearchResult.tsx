"use client"

import { PostStateProps } from "@/redux/slices/posts-search-slice"
import { GroupStateProps } from "@/redux/slices/search-slice"
import { RootState } from "@/redux/store"
import React from "react"
import { useSelector } from "react-redux"

type SearchResultsProps = {
  searchType: "GROUPS" | "POSTS"
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchType }) => {
  // Using Redux to access the search state for rendering the results
  const searchState = useSelector((state: RootState) => {
    return searchType === "GROUPS" ? state.search : state.PostSearch
  })

  if (searchState.isSearching) {
    return <p>Searching...</p>
  }

  if (!searchState.isSearching && searchState.data.length === 0) {
    return <p>No results found</p>
  }
  const results = Array.isArray(searchState.data) ? searchState.data : []
  return (
    <div>
      {results.map((item: any) => (
        <div key={item.id} className="p-4 mb-2 border rounded-md">
          {searchType === "GROUPS" ? (
            <>
              <h3 className="font-semibold">
                {(item as GroupStateProps).name}
              </h3>
              <p>{(item as GroupStateProps).description}</p>
            </>
          ) : (
            <>
              <h3 className="font-semibold">
                {(item as PostStateProps).title}
              </h3>
              <p>{(item as PostStateProps).content}</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default SearchResults
