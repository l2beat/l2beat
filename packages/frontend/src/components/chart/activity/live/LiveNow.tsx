import { formatActivityCount, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import {
  DEFAULT_LIVE_RANGE,
  isLiveFresh,
} from '~/server/features/layer2s/activity/live/liveRanges'
import { useTRPC } from '~/trpc/React'
import { LiveDot } from './LiveDot'

/**
 * The chain's rate right now, leading to the live view. It reads what the
 * live view opens on, so the view has it at hand
 */
export function LiveNow({
  project,
  metric,
  onOpen,
  onAvailable,
}: {
  project: ChartProject
  metric: ActivityMetric
  onOpen: () => void
  /** Told whether the chain's blocks are stored as they come */
  onAvailable: (available: boolean) => void
}) {
  const trpc = useTRPC()
  const { data } = useQuery({
    ...trpc.activity.liveProject.queryOptions({
      projectId: project.id,
      range: DEFAULT_LIVE_RANGE,
    }),
    refetchInterval: 10_000,
  })
  const available = data && isLiveFresh(data.newest, UnixTime.now())
  useEffect(() => {
    if (available !== undefined) onAvailable(available)
  }, [available, onAvailable])
  const now = data?.now
  if (!now) return null

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex items-center gap-2 text-sm"
    >
      <LiveDot />
      <RollingNumber
        value={now[metric]}
        format={formatActivityCount}
        className="font-bold"
      />
      <span className="text-secondary group-hover:text-primary group-hover:underline">
        {metric === 'uops' ? 'UOPS' : 'TPS'} now
      </span>
    </button>
  )
}
