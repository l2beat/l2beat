import {
  formatActivityCount,
  formatInteger,
  UnixTime,
} from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { memo, useLayoutEffect, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { TimeAgo, useNow } from '~/components/core/TimeAgo'
import { LiveIndicator } from '~/components/LiveIndicator'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { LiveBlock } from '~/server/features/layer2s/activity/utils/liveBlocks'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { EASE_OUT_QUINT } from '~/utils/easing'
import { LIVE_ACTIVITY_REFRESH_MS } from '~/utils/liveActivityRefresh'

/** The backend follows the chain every slot, so older means it stopped */
const STALE_AFTER = UnixTime.MINUTE
/** Five minutes of slots, so missed slots leave room on the left */
const SLOTS = 25
const BAR_STEP = 4
const BAR_WIDTH = 3
const HEIGHT = 48

const METRIC_UI = {
  tps: { rate: 'TPS', count: 'txs' },
  uops: { rate: 'UOPS', count: 'ops' },
} satisfies Record<ActivityMetric, { rate: string; count: string }>

/**
 * Ethereum's last five minutes, one bar per block, as the backend follows the
 * chain. A new bar slides in every slot
 */
export function EthereumLiveBlocks({ metric }: { metric: ActivityMetric }) {
  const trpc = useTRPC()
  const { data: blocks, isLoading } = useQuery(
    trpc.activity.ethereumLiveBlocks.queryOptions(undefined, {
      refetchInterval: LIVE_ACTIVITY_REFRESH_MS,
    }),
  )
  const now = useNow()

  if (isLoading) return <Skeleton className="h-[92px] w-full rounded-lg" />

  const newest = blocks?.at(-1)
  if (!blocks || !newest) {
    return (
      <div className="flex h-[92px] items-center justify-center rounded-lg bg-surface-secondary font-medium text-label-value-14 text-secondary">
        Live data unavailable
      </div>
    )
  }

  const ui = METRIC_UI[metric]
  const delayed = now !== undefined && now - newest.timestamp > STALE_AFTER
  const shown = blocks.slice(-SLOTS)
  const scale = niceCeil(Math.max(...shown.map((b) => rateOf(b, metric))))

  return (
    <div className="rounded-lg bg-surface-secondary p-3">
      <div className="flex items-center justify-between gap-3 font-medium text-label-value-12">
        <span className="flex min-w-0 items-center gap-1.5">
          <LiveIndicator disabled={delayed} />
          <span className={cn('shrink-0', delayed && 'text-secondary')}>
            {delayed ? 'Delayed' : 'Live'}
          </span>
          <span className="truncate text-secondary tabular-nums">
            · Block #{newest.number} · {formatInteger(countOf(newest, metric))}{' '}
            {ui.count} · <TimeAgo timestamp={newest.timestamp} />
          </span>
        </span>
        <span className="shrink-0 text-label-value-14 tabular-nums">
          {formatActivityCount(rateOf(newest, metric))} {ui.rate}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${SLOTS * BAR_STEP} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="mt-2 block h-12 w-full"
        role="img"
        aria-label={`${ui.rate} of each Ethereum block in the last five minutes`}
      >
        {shown.map((block, i) => (
          <LiveBar
            key={block.number}
            x={(SLOTS - shown.length + i) * BAR_STEP}
            height={Math.max(1, (rateOf(block, metric) / scale) * HEIGHT)}
            isNewest={i === shown.length - 1}
            title={`Block #${block.number}, ${formatTimestamp(block.timestamp, {
              mode: 'time',
            })}: ${formatInteger(countOf(block, metric))} ${ui.count}, ${formatActivityCount(
              rateOf(block, metric),
            )} ${ui.rate}`}
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between font-medium text-label-value-12 text-secondary">
        <span>5 min ago</span>
        <span>Now</span>
      </div>
    </div>
  )
}

/** Memoized, so a new block renders the bar it adds, not all of them */
const LiveBar = memo(function LiveBar({
  x,
  height,
  isNewest,
  title,
}: {
  x: number
  height: number
  isNewest: boolean
  title: string
}) {
  const ref = useRef<SVGRectElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  // biome-ignore lint/correctness/useExhaustiveDependencies: grows in once, as it arrives
  useLayoutEffect(() => {
    if (!isNewest || reducedMotion || !ref.current) return
    ref.current.animate(
      [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
      { duration: 500, easing: EASE_OUT_QUINT },
    )
  }, [])
  return (
    // The group slides each bar left as newer blocks come
    <g
      style={{
        transform: `translateX(${x}px)`,
        transition: reducedMotion
          ? undefined
          : `transform 700ms ${EASE_OUT_QUINT}`,
      }}
    >
      <rect
        ref={ref}
        y={HEIGHT - height}
        width={BAR_WIDTH}
        height={height}
        rx={0.5}
        className={isNewest ? 'fill-chart-ethereum' : 'fill-chart-ethereum/60'}
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
      >
        <title>{title}</title>
      </rect>
    </g>
  )
})

function countOf(block: LiveBlock, metric: ActivityMetric) {
  return metric === 'tps' ? block.count : block.uopsCount
}

function rateOf(block: LiveBlock, metric: ActivityMetric) {
  return countOf(block, metric) / block.seconds
}

/** 1, 2, 5, 10, 20, 50…, so the scale and every bar seldom change */
function niceCeil(value: number) {
  if (value <= 0) return 1
  const power = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 5, 10].find((s) => s * power >= value) ?? 10
  return step * power
}
