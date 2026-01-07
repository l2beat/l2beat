import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ErrorState } from '../common/ErrorState'
import { LoadingState } from '../common/LoadingState'
import { DISCORD_BOT_AVATAR_URL, DISCORD_BOT_NAME } from './api/const'
import { fetchData } from './api/fetchData'
import { DiffPreview } from './components/diff-preview'
import { Message } from './components/message'

const ITEMS_PER_PAGE = 20

export function MonitorApp() {
  const result = useQuery({
    queryKey: ['monitor-data'],
    queryFn: fetchData,
    staleTime: 1000 * 60, // 1 minute
  })

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const entries = result.data ?? []

  // Memoize visible entries to prevent unnecessary re-renders
  const visibleEntries = useMemo(() => {
    return entries.slice(0, visibleCount)
  }, [entries, visibleCount])

  const hasMore = visibleCount < entries.length

  // Load more items when sentinel comes into view
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    // Simulate async loading for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, entries.length))
      setIsLoadingMore(false)
    }, 100)
  }, [isLoadingMore, hasMore, entries.length])

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const entry = observerEntries[0]
        if (entry?.isIntersecting) {
          loadMore()
        }
      },
      {
        rootMargin: '100px', // Start loading before reaching the bottom
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [loadMore])

  if (result.isPending || result.isLoading) {
    return <LoadingState />
  }

  if (result.isError) {
    return <ErrorState />
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <p>Whoopsie, no changes detected.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 md:p-4">
      {visibleEntries.map((entry) => {
        const diffs = splitAndClean(entry.message)

        const diffPreviews = diffs.map((diff, index) => (
          <DiffPreview key={index} diff={diff} />
        ))

        return (
          <div
            key={`${entry.projectId}-${entry.timestamp}`}
            className="flex gap-2"
          >
            <Message
              authorName={DISCORD_BOT_NAME}
              timestamp={new Date(entry.timestamp * 1000).toUTCString()}
              title={
                <>
                  Detected changes on{' '}
                  <span className="font-bold">{entry.projectId}</span>
                </>
              }
              content={diffPreviews}
              avatarUrl={DISCORD_BOT_AVATAR_URL}
            />
          </div>
        )
      })}

      {/* Sentinel element for infinite scrolling */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {isLoadingMore ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <span className="text-gray-600 text-sm">Loading more...</span>
            </div>
          ) : (
            <div className="h-4" /> // Invisible trigger area
          )}
        </div>
      )}

      {/* Show total count */}
      <div className="flex justify-center py-2 text-gray-500 text-sm">
        Showing {visibleEntries.length} of {entries.length} entries
      </div>
    </div>
  )
}

function splitAndClean(s: string) {
  return s
    .split('```diff')
    .filter(Boolean)
    .map((s) => s.replace(/```/g, '').trim())
}
