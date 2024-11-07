import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { act } from "react"

type initialStateProps = {
  data: unknown[]
}

const initialState: initialStateProps = {
  data: [],
}

export const infiniteScroll = createSlice({
  name: "InfiniteScroll",
  initialState: initialState,
  reducers: {
    onInfiniteScroll: (state, action: PayloadAction<initialStateProps>) => {
      const list = state.data.find((data: any) =>
        action.payload.data.find((payload: any) => data.id === payload.id),
      )

      if (!list) state.data = [...state.data, ...action.payload.data]
    },
    onClearList: (state, action) => {
      state.data = action.payload.data
    },
  },
})

export const { onInfiniteScroll, onClearList } = infiniteScroll.actions
export default infiniteScroll.reducer
