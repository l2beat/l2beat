import { useInfiniteQuery } from '@tanstack/react-query'
import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { getDiffHistory } from '../../../api/api'
import type {
  ApiDiffHistoryEntry,
  ApiDiffHistorySection,
  ApiDiffHistorySectionKind,
} from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { Button } from '../../../components/Button'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { Markdown } from '../../../components/Markdown'
import { cn } from '../../../utils/cn'

const PAGE_SIZE = 10

const SECTION_TITLE: Record<ApiDiffHistorySectionKind, string> = {
  'watched-changes': 'Watched changes',
  'initial-discovery': 'Initial discovery',
  'source-code-changes': 'Source code changes',
  'config-related-changes': 'Config/verification related changes',
}

export function DiffHistoryPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const query = useInfiniteQuery({
    queryKey: ['projects', project, 'diff-history'],
    queryFn: ({ pageParam }) => getDiffHistory(project, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) => {
      const total = allPages[0]?.total ?? 0
      const loaded = allPages.reduce((n, p) => n + p.entries.length, 0)
      return loaded < total ? loaded : undefined
    },
  })

  const fetchNextPage = query.fetchNextPage
  const hasNextPage = query.hasNextPage
  const isFetchingNextPage = query.isFetchingNextPage

  useEffect(() => {
    const sentinel = sentinelRef.current
    const root = scrollRef.current
    if (!sentinel || !root || !hasNextPage) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { root, rootMargin: '400px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const [loadingAll, setLoadingAll] = useState(false)
  const loadAll = useCallback(async () => {
    const total = query.data?.pages[0]?.total ?? 0
    const loaded =
      query.data?.pages.reduce((n, p) => n + p.entries.length, 0) ?? 0
    const remaining = total - loaded
    if (remaining <= 0) return
    const ok = window.confirm(
      `Loading ${remaining} more entries at once may slow the UI down significantly. Continue?`,
    )
    if (!ok) return
    setLoadingAll(true)
    try {
      let result = query
      while (result.hasNextPage && !result.isFetchingNextPage) {
        result = await query.fetchNextPage()
      }
    } finally {
      setLoadingAll(false)
    }
  }, [query])

  if (query.isError) {
    return <ErrorState />
  }
  if (query.data === undefined) {
    return <LoadingState />
  }

  const entries = query.data.pages.flatMap((p) => p.entries)
  const total = query.data.pages[0]?.total ?? 0
  if (total === 0) {
    return <ActionNeededState message="No diffHistory.md for this project" />
  }

  const remaining = total - entries.length

  return (
    <div ref={scrollRef} className="flex h-full flex-col overflow-auto p-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-2xs text-coffee-400 italic">
        <span>
          Loaded {entries.length} / {total}
        </span>
        {remaining > 0 && (
          <Button size="small" disabled={loadingAll} onClick={loadAll}>
            Load all ({remaining} more)
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <Entry
            key={`${entry.discoveryHash ?? entry.date}-${i}`}
            entry={entry}
          />
        ))}
      </div>
      {remaining > 0 && (
        <div
          ref={sentinelRef}
          className="flex justify-center p-3 text-2xs text-coffee-400"
        >
          {isFetchingNextPage || loadingAll
            ? 'Loading…'
            : `${remaining} older entries`}
        </div>
      )}
    </div>
  )
}

const Entry = memo(function Entry({ entry }: { entry: ApiDiffHistoryEntry }) {
  return (
    <article className="border border-coffee-600 bg-coffee-800">
      <header className="flex flex-col gap-1 border-coffee-600 border-b p-2 text-xs">
        <div className="flex flex-wrap items-baseline gap-2">
          {entry.timestamp ? (
            <SwitchableValue
              className="font-bold"
              valueA={<h2>{entry.date}</h2>}
              valueB={<h2>{entry.timestamp}</h2>}
            />
          ) : (
            <h2 className="font-bold">{entry.date}</h2>
          )}
        </div>
        {entry.author && (
          <div className="text-coffee-400">author: {entry.author}</div>
        )}
        {(entry.comparing || entry.discoveryHash) && (
          <details className="text-2xs text-coffee-400">
            <summary className="cursor-pointer select-none">Metadata</summary>
            {entry.comparing && (
              <div className="break-all">
                comparing to: {entry.comparing.ref}@{entry.comparing.commit} ts:{' '}
                {entry.comparing.block}
              </div>
            )}
            {entry.discoveryHash && (
              <div className="break-all">
                discovered.json: {entry.discoveryHash}
              </div>
            )}
          </details>
        )}
      </header>
      {entry.description && (
        <div className="border-coffee-600 border-b">
          <Markdown>{entry.description}</Markdown>
        </div>
      )}
      {entry.sections.map((section, i) => (
        <CollapsibleSection key={i} section={section} />
      ))}
    </article>
  )
})

function CollapsibleSection({ section }: { section: ApiDiffHistorySection }) {
  const [open, setOpen] = useState(false)
  const title = SECTION_TITLE[section.kind]
  return (
    <section className="border-coffee-600 border-t">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 bg-coffee-700 px-2 py-1 text-left font-bold text-xs hover:bg-coffee-700/70"
      >
        <span className="inline-block w-3 text-coffee-400">
          {open ? '▾' : '▸'}
        </span>
        <span>{open ? `Hide ${title}` : `Show ${title}`}</span>
      </button>
      {open && <Markdown>{section.body}</Markdown>}
    </section>
  )
}

function SwitchableValue(props: {
  valueA: ReactNode
  valueB: ReactNode
  className?: string
}) {
  const [isSwitched, setIsSwitched] = useState(false)

  return (
    <div
      className={cn('cursor-pointer', props.className)}
      onClick={() => setIsSwitched(!isSwitched)}
    >
      {isSwitched ? props.valueB : props.valueA}
    </div>
  )
}
