"use client"

import { auth } from "@/auth"
import { LoginForm } from "@/components/forms/LoginForm"
import { currentUser } from "@/lib/auth"
import { ExtenderUser } from "@/next-auth"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const LoginPage = () => {
  const [user, setUser] = useState<ExtenderUser | null>(null)

  const route = useRouter()

  useEffect(() => {
    if (user) {
      route.push("/")
    }
  }, [])

  return (
    <>
      <LoginForm />
    </>
  )
}

export default LoginPage
