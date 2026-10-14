import {
  lazy,
  Component as ReactComponent,
  type ReactNode,
  Suspense,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useIsClient } from '~/hooks/useIsClient'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { cn } from '~/utils/cn'
import { BELT_HEIGHT, BeltLegend, PulseSkeleton } from './blocks/BeltFrame'
import { ChainClockContext, createChainClock } from './chainClock'
import { useIsOnScreen } from './hooks'
import { LivePosters } from './LivePosters'
import { type EthereumLink, LiveStats } from './LiveStats'
import { createLandings, LandingsContext } from './landings'
import { type BlockLimits, toLivePosters, totalByPoster } from './model'
import { useLiveBlobs } from './useLiveBlobs'

// Loaded on its own, as it draws only in the browser. Asked for as this module
// runs, before hydration, so it is in before the first live answer, which waits
// for hydration, and the table built after that answer never holds it up
const loadLiveBlocks = () => import('./blocks/LiveBlocks')
// a failure is the lazy load's to report, to LiveBoundary
if (typeof window !== 'undefined') loadLiveBlocks().catch(() => {})
const LiveBlocks = lazy(() =>
  loadLiveBlocks().then((m) => ({ default: m.LiveBlocks })),
)

interface Props {
  /** Every project that posts blobs to Ethereum */
  projects: BlobPoster[]
  limits: BlockLimits
  ethereum: EthereumLink
}

/** Ethereum's blobs, block by block, as they are made, above who posted them */
export function LiveBlobsCard({ projects, limits, ethereum }: Props) {
  const posters = useMemo(() => toLivePosters(projects), [projects])
  // the belt draws on a canvas sized to the screen, which the server has not got
  const isClient = useIsClient()
  const [landings] = useState(createLandings)
  const [clock] = useState(createChainClock)
  const cardRef = useRef<HTMLDivElement>(null)
  const { data, status } = useLiveBlobs(useIsOnScreen(cardRef))
  // in render, so every number below judges the newest block by the corrected
  // clock; a head that is not live is an old one, which would pull it back
  if (data?.live) clock.correct(data.head)
  const postedWindow = data?.window
  const totals = useMemo(
    () => postedWindow && totalByPoster(postedWindow.posted, posters),
    [postedWindow, posters],
  )
  const [tableFilled, fillTable] = useTableFill(data !== undefined)
  const tableLive = tableFilled ? data : undefined
  const tableTotals = tableFilled ? totals : undefined

  return (
    <ChainClockContext value={clock}>
      <LandingsContext value={landings}>
        <PrimaryCard ref={cardRef} className="space-y-5">
          <LiveStats
            live={data}
            totals={totals}
            status={status}
            limits={limits}
            ethereum={ethereum}
          />
          {isClient ? (
            <LiveBoundary>
              <Suspense fallback={<LiveSkeleton />}>
                <LiveBlocks
                  live={data}
                  status={status}
                  posters={posters}
                  limits={limits}
                  onBlocksDrawn={fillTable}
                />
              </Suspense>
            </LiveBoundary>
          ) : (
            <LiveSkeleton />
          )}
          <TableLandings filled={tableFilled}>
            <LivePosters live={tableLive} totals={tableTotals} />
          </TableLandings>
        </PrimaryCard>
      </LandingsContext>
    </ChainClockContext>
  )
}

/** The belt, the day under it and their legend, laid out as LiveBlocks lays them */
function LiveSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className={cn('w-full rounded-lg', BELT_HEIGHT)} />
      <PulseSkeleton />
      <BeltLegend />
    </div>
  )
}

/**
 * The table is thousands of elements, below a phone's first screen: built once
 * a frame is on screen after the belt first draws its blocks, or, should the
 * belt not draw, a while after the first answer. In a transition, so the
 * browser can still draw between its steps. Later answers reach it at once,
 * as its numbers count up with the belt
 */
function useTableFill(hasData: boolean) {
  const [filled, setFilled] = useState(false)
  // A task queued from a frame's callbacks runs once that frame is on screen.
  // Through a frame of its own, as the belt draws off screen outside of one
  const fill = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => startTransition(() => setFilled(true)))
    })
  }, [])
  useEffect(() => {
    if (filled || !hasData) return
    const timer = setTimeout(fill, FILL_WITHOUT_BELT_AFTER_MS)
    return () => clearTimeout(timer)
  }, [filled, hasData, fill])
  return [filled, fill] as const
}

const FILL_WITHOUT_BELT_AFTER_MS = 2000

/**
 * The belt's landings, for the table once it has been shown with data. Until
 * then its numbers hear none and hold nothing back: the block it first shows
 * is its to show whole, as the reader never saw the table without it, and that
 * block may have landed before the table was in
 */
function TableLandings({
  filled,
  children,
}: {
  filled: boolean
  children: ReactNode
}) {
  const landings = useContext(LandingsContext)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (filled) setShown(true)
  }, [filled])
  return (
    <LandingsContext value={shown ? landings : undefined}>
      {children}
    </LandingsContext>
  )
}

/**
 * Keeps a belt that fails to draw, or to load after a deploy, from taking the
 * page down with it: the stats and the table go on without it
 */
class LiveBoundary extends ReactComponent<
  { children: ReactNode },
  { error: Error | undefined }
> {
  state = { error: undefined }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error === undefined) return this.props.children
    return (
      <div className="flex h-[30rem] w-full flex-col items-center justify-center gap-2 rounded-lg bg-surface-secondary p-6 text-center md:h-[40rem]">
        <div className="font-bold text-heading-18">
          The blocks could not be drawn
        </div>
        <div className="max-w-[48ch] font-mono text-label-value-12 text-secondary">
          {String(this.state.error)}
        </div>
      </div>
    )
  }
}
