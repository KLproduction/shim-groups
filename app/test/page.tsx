"use client"

import React, { useEffect, useRef, useState } from "react"

import { ExtenderUser } from "@/next-auth"
import { currentUser } from "@/lib/auth"
import { useInfiniteQuery } from "@tanstack/react-query"
import { onGetScrollPost } from "@/data/channels"
import { PostCard } from "../group/[groupid]/channel/[channelid]/_components/post-feed/post-card"
import Header from "./hander"

type Props = {}

const TestPage = (props: Props) => {
  return (
    <div className="max-w-[100vw]">
      <div className="h-[calc(100vh-3rem)] bg-red-500 w-full bg-fixed"></div>
      <div className="left-0 w-full sticky top-0 h-12 bg-blue-500"></div>
      <div className="h-screen  bg-zinc-500"></div>
      <div className="h-screen  bg-green-500"></div>
    </div>
  )
}

export default TestPage
