import parser from "html-react-parser"
import { useEffect, useState } from "react"

type Props = {
  html: string
}

const HTMLparser = ({ html }: Props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(true)
  }, [])
  return (
    <div
      className="[&_h1]:text-4xl [&_h2]:text-3xl [&_blockqoute]:italic [&_iframe]: aspect-video
  [&_h3]:text-2xl text-themeTextGray flex flex-col gap-y-3"
    >
      {mounted && parser(html)}
    </div>
  )
}

export default HTMLparser
