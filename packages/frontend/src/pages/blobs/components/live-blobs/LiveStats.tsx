import { type ReactNode, useEffect, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { LiveIndicator } from '~/components/LiveIndicator'
import { SLOT_SECONDS } from '~/utils/beaconSlots'
import {
  BLOB_KIB,
  describeWindow,
  formatAverage,
  formatKib,
  formatRate,
  formatWhole,
} from './blocks/format'
import { useChainClock } from './chainClock'
import { useAnimationFrame } from './hooks'
import { type Landing, useHeldUntilLanded } from './landings'
import { type Arrival, Pop, RollingNumber, writeText } from './liveMotion'
import type { BlockLimits } from './model'
import { type LiveStatus, useLiveBlobs } from './useLiveBlobs'

const STATUS_TEXT: Record<LiveStatus, string> = {
  connecting: 'Connecting to Ethereum…',
  live: 'Live',
  reconnecting: 'Reconnecting…',
}

const formatArrivedKib = (blobs: number) => formatKib(blobs * BLOB_KIB)
const anyLanding = (_: Landing) => true

/** Ethereum's blob market over the last hour, at a glance, above the belt */
export function LiveStats({ limits }: { limits: BlockLimits }) {
  const { data, status } = useLiveBlobs()
  const hour = data?.window
  const seconds = (hour?.slots ?? 0) * SLOT_SECONDS
  // the newest block's blobs are counted in as the belt lands them
  const { held, arrival } = useHeldUntilLanded(
    data?.head,
    hour?.blobsPerSlot[0] ?? 0,
    anyLanding,
  )
  const blobs =
    hour && hour.posted.reduce((sum, posted) => sum + posted.blobs, 0) - held

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <span className="font-medium text-label-value-14 text-secondary">
          {hour ? describeWindow(hour.slots) : 'Last hour'}
        </span>
        <div className="flex items-center gap-4">
          {status === 'live' && <NextSlot head={data?.head} />}
          <div
            role="status"
            className="flex items-center gap-2 font-bold text-label-value-14 text-secondary"
          >
            <LiveIndicator disabled={status !== 'live'} />
            {STATUS_TEXT[status]}
          </div>
        </div>
      </div>
      {data && hour && blobs !== undefined && seconds > 0 ? (
        <dl className="mt-1 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3 lg:grid-cols-6">
          <Stat
            label="Blobs per block"
            note={`target ${limits.targetBlobsPerBlock}`}
          >
            <RollingNumber
              value={blobs / Math.max(1, hour.blocks)}
              format={formatAverage}
            />
          </Stat>
          <Stat label="Blobs" arrival={arrival}>
            <RollingNumber value={blobs} format={formatWhole} />
          </Stat>
          <Stat
            label="Data posted"
            arrival={arrival}
            formatArrival={formatArrivedKib}
          >
            <RollingNumber value={blobs * BLOB_KIB} format={formatKib} />
          </Stat>
          <Stat label="Blobs/s">
            <RollingNumber value={blobs / seconds} format={formatRate} />
          </Stat>
          <Stat label="KiB/s">
            <RollingNumber
              value={(blobs * BLOB_KIB) / seconds}
              format={formatRate}
            />
          </Stat>
          <Stat label="Projects">
            <RollingNumber
              value={hour.posted.filter((p) => p.projectId).length}
              format={formatWhole}
            />
          </Stat>
        </dl>
      ) : (
        <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}
    </div>
  )
}

const RING_RADIUS = 6
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

/**
 * How long until the next slot, as a ring that fills over the 12 seconds:
 * the wait between blocks, made visible. Drawn straight to the elements on
 * every frame, so it renders no React
 */
function NextSlot({ head }: { head: number | undefined }) {
  const clock = useChainClock()
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
      writeText(textRef.current, `Next slot in ${left}s`)
    }
  }, true)

  return (
    <div className="flex items-center gap-1.5 font-medium text-label-value-14 text-secondary tabular-nums">
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
      {/* the pop rises off the label line, where nothing else is in its way */}
      <dt className="relative font-medium text-label-value-14 text-secondary">
        {label}
        {arrival && (
          <Pop
            arrival={arrival}
            format={formatArrival}
            className="absolute top-0 right-0 whitespace-nowrap"
          />
        )}
      </dt>
      <dd className="flex items-baseline gap-2">
        <span className="font-bold text-heading-28">{children}</span>
        {note && (
          <span className="truncate font-medium text-label-value-12 text-secondary">
            {note}
          </span>
        )}
      </dd>
    </div>
  )
}
