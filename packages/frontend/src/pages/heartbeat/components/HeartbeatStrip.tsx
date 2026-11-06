import { formatActivityCount } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { HeartbeatProject } from '~/server/features/heartbeat/getHeartbeatProjects'
import { EkgTrace } from './EkgTrace'
import { type HeartbeatMetric, rankChains, sumBeats } from './rankChains'
import { useHeartbeat } from './useHeartbeat'

const SHOWN_CHAINS = 4

/** Every followed chain's line in one, leading to the page with each of them */
export function HeartbeatStrip({
  projects,
  metric,
}: {
  projects: HeartbeatProject[]
  metric: Extract<HeartbeatMetric, 'uops' | 'tps'>
}) {
  const { data } = useHeartbeat()
  const ranked = useMemo(
    () => (data ? rankChains(projects, data, metric) : undefined),
    [projects, data, metric],
  )
  if (ranked?.length === 0) return null
  const total = ranked?.reduce((sum, row) => sum + row.chain[metric], 0)

  return (
    <PrimaryCard className="mb-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-brand-deep text-xs uppercase tracking-wide">
            Live
          </span>
          <span className="font-bold text-xl tabular-nums">
            {total === undefined ? '…' : formatActivityCount(total)}
          </span>
          <span className="text-secondary text-sm">
            {metric === 'uops' ? 'UOPS' : 'TPS'}
            {ranked && ` on ${ranked.length} chains, last minute`}
          </span>
        </div>
        <a
          href="/layer2s/activity/live"
          className="flex items-center gap-1 font-bold text-brand-deep text-sm hover:underline"
        >
          Every chain's heartbeat
          <ArrowRightIcon className="size-3 fill-current" />
        </a>
      </div>
      {ranked === undefined ? (
        <Skeleton className="h-14 w-full" />
      ) : (
        <EkgTrace
          seconds={sumBeats(ranked.map((r) => r.chain))}
          newest={Math.max(...ranked.map((r) => r.chain.newest))}
          bold
          className="h-14"
        />
      )}
      {ranked && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-secondary text-xs">
          {ranked.slice(0, SHOWN_CHAINS).map(({ project, chain }) => (
            <span key={project.id} className="tabular-nums">
              <span className="font-medium text-primary">{project.name}</span>{' '}
              {formatActivityCount(chain[metric])}
            </span>
          ))}
        </div>
      )}
    </PrimaryCard>
  )
}
