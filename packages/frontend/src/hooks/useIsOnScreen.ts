import { type RefObject, useEffect, useState } from 'react'

export function useIsOnScreen(ref: RefObject<Element | null>): boolean {
  const [onScreen, setOnScreen] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry?.isIntersecting ?? false),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return onScreen
}
