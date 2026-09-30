import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { formatBytes } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ProjectDaAbsoluteThroughputChart } from '~/components/chart/data-availability/ProjectDaAbsoluteThroughputChart'
import { getDataWithConfiguredThroughputs } from '~/components/chart/data-availability/ThroughputSectionChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { Skeleton } from '~/components/core/Skeleton'
import { CustomLink } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
import { useTRPC } from '~/trpc/React'
import { optionToRange, rangeToResolution } from '~/utils/range/range'

export interface DaSummaryThroughputChartProps {
  project: ChartProject
  configuredThroughputs: DaLayerThroughput[]
  milestones: Milestone[]
}

/**
 * The throughput chart of the DA layer's own page: what was posted per day
 * against the target and the maximum the layer allows.
 */
export function DaSummaryThroughputChart({
  project,
  configuredThroughputs,
  milestones,
}: DaSummaryThroughputChartProps) {
  const trpc = useTRPC()
  // Kept for the life of the page, a new range every render would refetch
  const [range] = useState(() => optionToRange('1y'))
  const resolution = useMemo(() => rangeToResolution(range), [range])

  const { data, isLoading } = useQuery(
    trpc.da.projectCharts.queryOptions({
      range,
      projectId: project.id,
      // Everything posted counts towards the capacity, not only what
      // scaling projects posted
      includeL2Only: false,
    }),
  )
  const { data: pastDay } = useQuery(
    trpc.da.flows.queryOptions({ daLayerId: project.id }),
  )

  const dataWithConfiguredThroughputs = getDataWithConfiguredThroughputs(
    data?.totalChart.data,
    configuredThroughputs,
    resolution,
  )

  return (
    <div className="flex flex-col gap-4">
      <Header
        used={pastDay?.used}
        capacity={pastDay?.capacity}
        isLoading={pastDay === undefined}
      />
      <ProjectDaAbsoluteThroughputChart
        project={project}
        dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
        isLoading={isLoading}
        milestones={milestones}
        syncedUntil={data?.syncedUntil}
        resolution={resolution}
        dataGap={data?.totalChart.dataGap}
      />
    </div>
  )
}

function Header({
  used,
  capacity,
  isLoading,
}: {
  used: number | undefined
  capacity: number | undefined
  isLoading: boolean
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl">Data Posted</span>
          <a
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none max-md:hidden"
            href="/data-availability/throughput"
          >
            View details
            <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
          </a>
        </div>
        <CustomLink
          href="/data-availability/throughput"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="-rotate-90 size-2 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right font-bold text-xl">
          {isLoading || used === undefined ? (
            <Skeleton className="my-[5px] h-5 w-32" />
          ) : (
            formatBytes(used)
          )}
        </div>
        {isLoading || used === undefined ? (
          <Skeleton className="my-0.5 h-4 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-secondary text-xs">
            {capacity === undefined
              ? 'past day'
              : `${((used / capacity) * 100).toFixed(1)}% of target / past day`}
          </p>
        )}
      </div>
    </div>
  )
}
