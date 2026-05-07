import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
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
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { Markdown } from '../../../components/Markdown'
import { IconArrowToDotDown } from '../../../icons/IconArrowToDotDown'
import { IconArrowToDotUp } from '../../../icons/IconArrowToDotUp'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconDownload } from '../../../icons/IconDownload'
import { IconFoldVertical } from '../../../icons/IconFoldVertical'
import { IconRefresh } from '../../../icons/IconRefresh'
import { IconUnfoldVertical } from '../../../icons/IconUnfoldVertical'
import { cn } from '../../../utils/cn'

const PAGE_SIZE = 10

const SECTION_TITLE: Record<ApiDiffHistorySectionKind, string> = {
  'watched-changes': 'Watched changes',
  'initial-discovery': 'Initial discovery',
  'source-code-changes': 'Source code changes',
  'config-related-changes': 'Config/verification related changes',
}

type BulkOp = { kind: 'expand' | 'collapse' } | null

export function DiffHistoryPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const queryKey = ['projects', project, 'diff-history'] as const

  const query = useInfiniteQuery({
    queryKey,
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

  const [bulkOp, setBulkOp] = useState<BulkOp>(null)
  const expandAll = useCallback(() => setBulkOp({ kind: 'expand' }), [])
  const collapseAll = useCallback(() => setBulkOp({ kind: 'collapse' }), [])

  const jumpTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  const jumpBottom = useCallback(() => {
    const root = scrollRef.current
    if (root) root.scrollTo({ top: root.scrollHeight, behavior: 'smooth' })
  }, [])
  const jumpEntry = useCallback((delta: -1 | 1) => {
    const root = scrollRef.current
    if (!root) return
    const articles = root.querySelectorAll<HTMLElement>('[data-entry-idx]')
    if (articles.length === 0) return
    let current = 0
    for (let i = 0; i < articles.length; i++) {
      const el = articles[i]
      if (!el) break
      if (el.offsetTop > root.scrollTop + 1) break
      current = i
    }
    let target: HTMLElement | undefined
    if (delta === -1) {
      const currentEl = articles[current]
      // Scrolled past current's header? Snap back to it. Otherwise go to prev.
      if (currentEl && root.scrollTop > currentEl.offsetTop + 5) {
        target = currentEl
      } else if (current > 0) {
        target = articles[current - 1]
      }
    } else {
      if (current < articles.length - 1) {
        target = articles[current + 1]
      }
    }
    if (target) {
      root.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    }
  }, [])

  const reload = useCallback(() => {
    void queryClient.resetQueries({ queryKey, exact: true })
  }, [queryClient, queryKey])

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
    <div className="relative h-full">
      <div ref={scrollRef} className="flex h-full flex-col overflow-auto p-2">
        <div className="flex flex-col gap-3">
          {entries.map((entry, i) => (
            <Entry
              key={`${entry.discoveryHash ?? entry.date}-${i}`}
              entry={entry}
              index={i}
              bulkOp={bulkOp}
            />
          ))}
        </div>
        {remaining > 0 && (
          <div
            ref={sentinelRef}
            className="flex justify-center p-3 text-2xs text-coffee-400 italic"
          >
            {isFetchingNextPage || loadingAll
              ? 'Loading…'
              : `${remaining} older entries`}
          </div>
        )}
      </div>
      <Toolbar
        loaded={entries.length}
        total={total}
        onTop={jumpTop}
        onPrev={() => jumpEntry(-1)}
        onNext={() => jumpEntry(1)}
        onBottom={jumpBottom}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        onReload={reload}
        onLoadAll={remaining > 0 ? loadAll : undefined}
        loadAllDisabled={loadingAll}
      />
    </div>
  )
}

interface ToolbarProps {
  loaded: number
  total: number
  onTop: () => void
  onPrev: () => void
  onNext: () => void
  onBottom: () => void
  onExpandAll: () => void
  onCollapseAll: () => void
  onReload: () => void
  onLoadAll: (() => void) | undefined
  loadAllDisabled: boolean
}

function Toolbar(props: ToolbarProps) {
  return (
    <div className="absolute right-3 bottom-1 z-10 flex flex-col items-stretch gap-0.5 rounded border border-coffee-600 bg-coffee-800/95 p-1 shadow-lg backdrop-blur">
      {props.onLoadAll && (
        <>
          <ToolbarButton
            title="Load all entries"
            onClick={props.onLoadAll}
            disabled={props.loadAllDisabled}
          >
            <IconDownload />
          </ToolbarButton>
          <hr className="my-0.5 border-coffee-600" />
        </>
      )}
      <ToolbarButton title="Jump to top" onClick={props.onTop}>
        <IconArrowToDotUp />
      </ToolbarButton>
      <ToolbarButton title="Previous entry" onClick={props.onPrev}>
        <IconChevronDown className="rotate-180" />
      </ToolbarButton>
      <ToolbarButton title="Next entry" onClick={props.onNext}>
        <IconChevronDown />
      </ToolbarButton>
      <ToolbarButton title="Jump to bottom" onClick={props.onBottom}>
        <IconArrowToDotDown />
      </ToolbarButton>
      <hr className="my-0.5 border-coffee-600" />
      <ToolbarButton title="Expand all sections" onClick={props.onExpandAll}>
        <IconUnfoldVertical />
      </ToolbarButton>
      <ToolbarButton
        title="Collapse all sections"
        onClick={props.onCollapseAll}
      >
        <IconFoldVertical />
      </ToolbarButton>
      <hr className="my-0.5 border-coffee-600" />
      <ToolbarButton title="Unload + reload" onClick={props.onReload}>
        <IconRefresh />
      </ToolbarButton>
      <hr className="my-0.5 border-coffee-600" />

      <div
        title={`${props.loaded} of ${props.total} entries loaded`}
        className="px-1 text-center text-[7px] text-coffee-400 italic"
      >
        <div>{props.loaded}</div>
        out of
        <div>{props.total}</div>
      </div>
    </div>
  )
}

function ToolbarButton(props: {
  title: string
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      disabled={props.disabled}
      className="flex h-7 w-7 items-center justify-center rounded text-coffee-200 hover:bg-coffee-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
    >
      {props.children}
    </button>
  )
}

interface EntryProps {
  entry: ApiDiffHistoryEntry
  index: number
  bulkOp: BulkOp
}

const Entry = memo(function Entry({ entry, index, bulkOp }: EntryProps) {
  return (
    <article
      data-entry-idx={index}
      className="border border-coffee-600 bg-coffee-800"
    >
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
        <CollapsibleSection key={i} section={section} bulkOp={bulkOp} />
      ))}
    </article>
  )
})

function CollapsibleSection(props: {
  section: ApiDiffHistorySection
  bulkOp: BulkOp
}) {
  const { section, bulkOp } = props
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (bulkOp?.kind === 'expand') setOpen(true)
    else if (bulkOp?.kind === 'collapse') setOpen(false)
  }, [bulkOp])

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
