import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { LiveIndicator } from '~/components/LiveIndicator'
import { formatPercent } from '~/utils/calculatePercentageChange'
import {
  BLOB_KIB,
  describeWindow,
  formatAverage,
  formatKib,
  formatWhole,
} from './blocks/format'
import { useChainClock } from './chainClock'
import { mixColors, readableColor } from './color'
import { useAnimationFrame, useIsOnScreen, useThemeTokens } from './hooks'
import { LIVE_POSTERS_ID } from './LivePosters'
import { type Landing, useLandedTotal } from './landings'
import { type Arrival, Pop, RollingNumber, writeText } from './liveMotion'
import { type BlockLimits, type LivePoster, UNKNOWN_ID } from './model'
import { type LiveStatus, useLiveBlobs } from './useLiveBlobs'

const STATUS_TEXT: Record<LiveStatus, string> = {
  connecting: 'Connecting to Ethereum…',
  live: 'Live from Ethereum',
  reconnecting: 'Reconnecting to Ethereum…',
}

/** Projects named under the strip; the rest are counted */
const NAMED_POSTERS = 4

const formatArrivedKib = (blobs: number) => formatKib(blobs * BLOB_KIB)
const anyLanding = (_: Landing) => true

/**
 * Ethereum's blob market over the last 24 hours, above the belt: the headline
 * numbers with whether they are live level with them, then the day's blobs
 * as one strip split by who posted them, in the colors the belt uses
 */
export function LiveStats({
  limits,
  posters,
}: {
  limits: BlockLimits
  /** Every project that may post, with the stand-in for unknown senders last */
  posters: LivePoster[]
}) {
  const { data, status } = useLiveBlobs()
  const postedWindow = data?.window
  // the newest block's blobs are counted in as the belt lands them
  const newest = postedWindow?.newestBlobs ?? 0
  const { value: blobs, arrival } = useLandedTotal(
    data?.head,
    postedWindow?.posted.reduce((sum, posted) => sum + posted.blobs, 0) ?? 0,
    newest,
    newest,
    anyLanding,
  )
  const shares = useShares(postedWindow?.posted ?? [], posters)
  const ready = postedWindow !== undefined && postedWindow.slots > 0
  const projects = postedWindow?.posted.filter((p) => p.projectId).length ?? 0

  return (
    <div>
      {/* On a phone the status takes the corner beside the first number, so
          it never sits on a line of its own above them */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:items-end md:gap-x-8">
        {ready ? (
          <>
            <Stat label="Blobs posted" arrival={arrival}>
              <RollingNumber value={blobs} format={formatWhole} />
            </Stat>
            <Stat
              label="Data"
              arrival={arrival}
              formatArrival={formatArrivedKib}
            >
              <RollingNumber value={blobs * BLOB_KIB} format={formatKib} />
            </Stat>
            <Stat
              label="Per block"
              note={`of ${limits.targetBlobsPerBlock} target`}
            >
              <RollingNumber
                value={blobs / Math.max(1, postedWindow.blocks)}
                format={formatAverage}
              />
            </Stat>
          </>
        ) : (
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-[52px] w-full md:w-32" />
          ))
        )}
        <div className="col-start-2 row-start-1 flex flex-col items-end gap-1.5 md:ml-auto">
          <StatusText status={status} />
          {status === 'live' && <NextBlock head={data?.head} />}
        </div>
      </dl>
      {ready ? (
        <>
          <ShareStrip shares={shares} blobs={blobs} projects={projects} />
          <ShareLegend
            shares={shares}
            projects={projects}
            title={`${describeWindow(postedWindow.slots)}, by project`}
          />
        </>
      ) : (
        <Skeleton className="mt-4 h-12 w-full" />
      )}
    </div>
  )
}

function Stat({
  label,
  note,
  arrival,
  formatArrival,
  children,
}: {
  label: string
  note?: string
  arrival?: Arrival
  formatArrival?: (amount: number) => string
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      {/* The pop rises off the label line, where nothing else is in its way,
          right after the label, so it reads as what this number just got */}
      <dt className="font-medium text-label-value-13 text-secondary">
        <span className="relative">
          {label}
          {arrival && (
            <Pop
              arrival={arrival}
              format={formatArrival}
              className="absolute top-0 left-full ml-1.5 whitespace-nowrap"
            />
          )}
        </span>
      </dt>
      <dd className="flex items-baseline gap-1.5">
        <span className="font-bold text-heading-32 leading-none md:text-heading-36">
          {children}
        </span>
        {note && (
          <span className="font-medium text-label-value-13 text-secondary">
            {note}
          </span>
        )}
      </dd>
    </div>
  )
}

function StatusText({ status }: { status: LiveStatus }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2 font-bold text-label-value-14 text-secondary"
    >
      <LiveIndicator disabled={status !== 'live'} />
      {STATUS_TEXT[status]}
    </div>
  )
}

const RING_RADIUS = 6
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

/**
 * How long until the next block, as a ring that fills over the 12 seconds:
 * the wait between blocks, made visible. Drawn straight to the elements on
 * every frame it is on screen, so it renders no React
 */
function NextBlock({ head }: { head: number | undefined }) {
  const clock = useChainClock()
  const rootRef = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(rootRef)
  const ringRef = useRef<SVGCircleElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (head !== undefined) clock.correct(head)
  }, [clock, head])

  useAnimationFrame(() => {
    const progress = clock.progressNow()
    const into = progress - Math.floor(progress)
    ringRef.current?.setAttribute(
      'stroke-dashoffset',
      String(RING_LENGTH * (1 - into)),
    )
    if (textRef.current) {
      const left = Math.max(1, Math.ceil((1 - into) * SLOT_SECONDS))
      writeText(textRef.current, `Next block in ${left}s`)
    }
  }, onScreen)

  return (
    <div
      ref={rootRef}
      className="flex items-center gap-1.5 font-medium text-label-value-14 text-secondary tabular-nums"
    >
      <svg viewBox="0 0 16 16" className="-rotate-90 size-4" aria-hidden>
        <circle
          cx={8}
          cy={8}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={2}
          className="stroke-divider"
        />
        <circle
          ref={ringRef}
          cx={8}
          cy={8}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH}
          className="stroke-brand"
        />
      </svg>
      <span ref={textRef} />
    </div>
  )
}

interface PosterShare {
  id: string
  name: string
  /** Of all blobs in the window, 0 to 1 */
  share: number
  /** The poster's color as the belt draws it */
  color: string
}

/** Each poster's share of the day, most blobs first, as the window has them */
function useShares(
  posted: { projectId?: string; blobs: number }[],
  posters: LivePoster[],
): PosterShare[] {
  const { surface } = useThemeTokens()
  const byId = new Map(posters.map((poster) => [poster.id, poster]))
  const total = Math.max(
    1,
    posted.reduce((sum, p) => sum + p.blobs, 0),
  )
  // blobs no project claims go to the stand-in, as on the belt
  const unknown = byId.get(UNKNOWN_ID)
  return posted.flatMap((p) => {
    const poster = byId.get(p.projectId ?? UNKNOWN_ID) ?? unknown
    if (!poster) return []
    return {
      id: p.projectId ?? UNKNOWN_ID,
      name: poster.name,
      share: p.blobs / total,
      color: readableColor(poster.color, surface),
    }
  })
}

/** A tile like the belt's: its color, lit along the top edge like a gel */
function gel(color: string): CSSProperties {
  return {
    backgroundColor: color,
    boxShadow: `inset 0 1px 0 ${mixColors(color, '#ffffff', 0.45)}`,
  }
}

/** The day's blobs as one strip, a stretch of it per poster */
function ShareStrip({
  shares,
  blobs,
  projects,
}: {
  shares: PosterShare[]
  blobs: number
  projects: number
}) {
  return (
    <div
      className="mt-4 flex h-4 gap-[2px] overflow-hidden rounded-[3px] md:h-5"
      role="img"
      aria-label={`${formatWhole(blobs)} blobs from ${projects} projects`}
    >
      {shares.map((share) => (
        <div
          key={share.id}
          title={`${share.name} · ${formatPercent(share.share)}`}
          className="h-full min-w-[2px] rounded-[2px] transition-[flex-grow] duration-700 ease-out"
          style={{ flexGrow: share.share, flexBasis: 0, ...gel(share.color) }}
        />
      ))}
    </div>
  )
}

function ShareLegend({
  shares,
  projects,
  title,
}: {
  shares: PosterShare[]
  projects: number
  title: string
}) {
  // the unknown share has no name to read, and its gray tells it apart already
  const named = shares
    .filter((share) => share.id !== UNKNOWN_ID)
    .slice(0, NAMED_POSTERS)
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-label-value-12 text-secondary">
      <span className="font-bold text-primary">{title}</span>
      {named.map((share) => (
        <span key={share.id} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px]" style={gel(share.color)} />
          {share.name}
          <span className="font-bold text-primary tabular-nums">
            {formatPercent(share.share)}
          </span>
        </span>
      ))}
      {projects > named.length && (
        <a
          href={`#${LIVE_POSTERS_ID}`}
          className="underline decoration-dotted underline-offset-2 hover:text-primary"
        >
          +{projects - named.length} more
        </a>
      )}
    </div>
  )
}
