import { formatActivityCount, formatNumber } from '@l2beat/shared-pure'
import { useMemo, useRef, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useReorder } from '~/hooks/useReorder'
import type { HeartbeatProject } from '~/server/features/heartbeat/getHeartbeatProjects'
import { cn } from '~/utils/cn'
import { EkgTrace } from './EkgTrace'
import {
  type HeartbeatMetric,
  keepOrder,
  type RankedChain,
  rankChains,
  sumBeats,
} from './rankChains'
import { useHeartbeat } from './useHeartbeat'

/** Rates move a little on every refresh, so rows only trade places this often */
const RERANK_SECONDS = 10

const METRICS: Record<
  HeartbeatMetric,
  { label: string; format: (value: number) => string }
> = {
  uops: { label: 'UOPS', format: (value) => formatActivityCount(value) },
  tps: { label: 'TPS', format: (value) => formatActivityCount(value) },
  gasPerSecond: {
    label: 'Gas/s',
    format: (value) => `${formatNumber(value / 1e6, 1)}M`,
  },
}

export function HeartbeatMonitor({
  projects,
}: {
  projects: HeartbeatProject[]
}) {
  const { data } = useHeartbeat()
  const [metric, setMetric] = useState<HeartbeatMetric>('uops')
  const latest = useMemo(
    () => (data ? rankChains(projects, data, metric) : undefined),
    [projects, data, metric],
  )
  const rerankAt = data ? Math.floor(data.readAt / RERANK_SECONDS) : undefined
  // biome-ignore lint/correctness/useExhaustiveDependencies: ranked again only when `rerankAt` or the metric moves on
  const order = useMemo(
    () => latest?.map((row) => row.project.id),
    [rerankAt, metric],
  )
  const ranked = latest && order ? keepOrder(latest, order) : latest
  const listRef = useRef<HTMLOListElement>(null)
  useReorder(listRef, ranked?.map((r) => r.project.id).join() ?? '')

  return (
    <PrimaryCard className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Total ranked={ranked} metric={metric} />
        <RadioGroup
          name="heartbeatMetric"
          value={metric}
          onValueChange={(value) => setMetric(value as HeartbeatMetric)}
        >
          {Object.entries(METRICS).map(([value, { label }]) => (
            <RadioGroupItem key={value} value={value}>
              {label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>
      {ranked === undefined ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <EkgTrace
          seconds={sumBeats(ranked.map((r) => r.chain))}
          newest={Math.max(...ranked.map((r) => r.chain.newest))}
          bold
          className="h-20"
        />
      )}
      {ranked === undefined ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : ranked.length === 0 ? (
        <p className="py-8 text-center text-secondary">
          No chain is followed block by block yet.
        </p>
      ) : (
        <ol ref={listRef} className="flex flex-col">
          {ranked.map((row, i) => (
            <ChainRow
              key={row.project.id}
              row={row}
              rank={i + 1}
              metric={metric}
            />
          ))}
        </ol>
      )}
    </PrimaryCard>
  )
}

function Total({
  ranked,
  metric,
}: {
  ranked: RankedChain[] | undefined
  metric: HeartbeatMetric
}) {
  const { label, format } = METRICS[metric]
  const total = ranked?.reduce((sum, row) => sum + row.chain[metric], 0)
  return (
    <div>
      <div className="font-medium text-secondary text-xs uppercase tracking-wide">
        All chains, last minute
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-3xl tabular-nums">
          {total === undefined ? '…' : format(total)}
        </span>
        <span className="font-bold text-brand-deep">{label}</span>
        {ranked && (
          <span className="text-secondary text-sm">
            on {ranked.length} chains
          </span>
        )}
      </div>
    </div>
  )
}

function ChainRow({
  row,
  rank,
  metric,
}: {
  row: RankedChain
  rank: number
  metric: HeartbeatMetric
}) {
  const { project, chain, behindBy } = row
  const { label, format } = METRICS[metric]
  const name = (
    <span className="flex min-w-0 items-center gap-2">
      <img
        src={project.iconUrl}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0"
      />
      <span className="truncate font-bold">{project.name}</span>
    </span>
  )
  return (
    <li
      data-flip-key={project.id}
      className={cn(
        'grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-divider border-b py-2 last:border-b-0',
        'md:grid-cols-[1.5rem_11rem_minmax(0,1fr)_7rem]',
        behindBy !== undefined && 'opacity-60',
      )}
    >
      <span className="text-right text-secondary text-sm tabular-nums">
        {rank}
      </span>
      {project.href ? (
        <a href={project.href} className="min-w-0 hover:underline">
          {name}
        </a>
      ) : (
        name
      )}
      <EkgTrace
        seconds={chain.beats}
        newest={chain.newest}
        className="h-10 max-md:col-span-full max-md:row-start-2"
      />
      <div className="text-right">
        <div className="font-bold tabular-nums">
          {format(chain[metric])}{' '}
          <span className="font-medium text-secondary text-xs">{label}</span>
        </div>
        <div className="text-secondary text-xs tabular-nums">
          {behindBy !== undefined
            ? `${formatBehind(behindBy)} behind`
            : `${chain.blocks} blocks/min`}
        </div>
      </div>
    </li>
  )
}

function formatBehind(seconds: number) {
  return seconds < 3600
    ? `${Math.round(seconds / 60)} min`
    : `${Math.round(seconds / 3600)} h`
}
