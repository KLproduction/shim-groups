//this is our redux store
"use client"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { OnlineTracking } from "./slices/online-member-slice"
import { Search } from "./slices/search-slice"
import { PostSearch } from "./slices/posts-search-slice"
import infiniteScrollReducer, {
  infiniteScroll,
} from "./slices/infinite-scroll-slice"

const rootReducer = combineReducers({
  onlineTracking: OnlineTracking.reducer,
  search: Search.reducer,
  PostSearch: PostSearch.reducer,
  infiniteScroll: infiniteScroll.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

//we export these type definitions
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//this useAppSelector has type definitions added
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
