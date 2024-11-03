import { Channel, Like, User, Comment } from "@prisma/client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type PostStateProps = {
  id: string
  createdAt: Date
  title?: string
  htmlContent?: string
  jsonContent?: string
  content: string
  authorId: string
  channelId: string
  author: User
  likes: Like[]
  comments: Comment[]
  channel: Channel
}

type InitialStateProps = {
  isSearching?: boolean
  status?: number | undefined
  data: PostStateProps[]
  debounce?: string
}

const InitialState: InitialStateProps = {
  isSearching: false,
  status: undefined,
  data: [],
  debounce: "",
}

export const PostSearch = createSlice({
  name: "postSearch",
  initialState: InitialState,
  reducers: {
    onPostSearch: (state, action: PayloadAction<InitialStateProps>) => {
      return { ...state, ...action.payload }
    },
    clearPostSearch: () => {
      return InitialState
    },
  },
})

export const { onPostSearch, clearPostSearch } = PostSearch.actions
export default PostSearch.reducer
