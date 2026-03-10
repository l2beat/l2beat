import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
}

export function HorizontalScrollContainer({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showFade, setShowFade] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => {
      const atEnd = el.scrollWidth - el.scrollLeft - el.clientWidth < 4
      setShowFade(!atEnd && el.scrollWidth > el.clientWidth)
    }
    check()
    el.addEventListener('scroll', check)
    window.addEventListener('resize', check)
    return () => {
      el.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex flex-col gap-4 md:flex-row md:overflow-x-auto"
      >
        {children}
      </div>
      {showFade && (
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-10 bg-gradient-to-l from-background to-transparent md:block" />
      )}
    </div>
  )
}
