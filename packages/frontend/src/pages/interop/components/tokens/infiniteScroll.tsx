import type { ReactNode, RefObject } from 'react'
import { useEffect, useRef } from 'react'

export function useInfiniteScrollTrigger({
  canLoadMore,
  loadMore,
}: {
  canLoadMore: boolean
  loadMore: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !canLoadMore) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMore()
      }
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [canLoadMore, loadMore])

  return ref
}

export function InfiniteScrollTrigger({
  triggerRef,
}: {
  triggerRef: RefObject<HTMLDivElement | null>
}) {
  return <div ref={triggerRef} className="h-px" />
}

export function LoadingMoreText({ children }: { children: ReactNode }) {
  return (
    <div className="py-2 text-center font-medium text-label-value-14 text-secondary">
      {children}
    </div>
  )
}
