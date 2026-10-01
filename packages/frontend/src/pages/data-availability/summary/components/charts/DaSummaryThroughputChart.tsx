import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { formatBytes } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { DaThroughputByProjectChart } from '~/components/chart/data-availability/DaThroughputByProjectChart'
import { ProjectDaAbsoluteThroughputChart } from '~/components/chart/data-availability/ProjectDaAbsoluteThroughputChart'
import { getDataWithConfiguredThroughputs } from '~/components/chart/data-availability/ThroughputSectionChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { ViewDetailsLink } from '~/components/ViewDetailsLink'
import { useTRPC } from '~/trpc/React'
import { optionToRange, rangeToResolution } from '~/utils/range/range'

export interface DaSummaryThroughputChartProps {
  project: ChartProject
  configuredThroughputs: DaLayerThroughput[]
  milestones: Milestone[]
  /** Project colors by name, for the per-project breakdown */
  customColors: Record<string, string>
  /** The throughput section of the DA layer's own page */
  detailsHref: string
}

type View = 'total' | 'per-project'

/**
 * The throughput charts of the DA layer's own page: what was posted per day
 * against the target and the maximum the layer allows, or who posted it.
 */
export function DaSummaryThroughputChart({
  project,
  configuredThroughputs,
  milestones,
  customColors,
  detailsHref,
}: DaSummaryThroughputChartProps) {
  const trpc = useTRPC()
  const [view, setView] = useState<View>('total')
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
    <div className="flex flex-col gap-4 lg:contents">
      <Header
        used={pastDay?.used}
        capacity={pastDay?.capacity}
        isLoading={pastDay === undefined}
        view={view}
        setView={setView}
        detailsHref={detailsHref}
      />
      {view === 'total' ? (
        <ProjectDaAbsoluteThroughputChart
          project={project}
          dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
          isLoading={isLoading}
          milestones={milestones}
          syncedUntil={data?.syncedUntil}
          resolution={resolution}
          dataGap={data?.totalChart.dataGap}
          hideProjectLogo
        />
      ) : (
        <DaThroughputByProjectChart
          data={data?.byProjectChart.data}
          syncedUntil={data?.syncedUntil}
          isLoading={isLoading}
          customColors={customColors}
          milestones={milestones}
          resolution={resolution}
        />
      )}
    </div>
  )
}

function Header({
  used,
  capacity,
  isLoading,
  view,
  setView,
  detailsHref,
}: {
  used: number | undefined
  capacity: number | undefined
  isLoading: boolean
  view: View
  setView: (view: View) => void
  detailsHref: string
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-bold text-xl">Data Posted</span>
          {/* as tall as the title, so the link under it stays level with
              the line under the value */}
          <RadioGroup
            name="daSummaryThroughputView"
            value={view}
            onValueChange={(value) => setView(value as View)}
            className="h-7"
          >
            <RadioGroupItem value="total">Total</RadioGroupItem>
            <RadioGroupItem value="per-project">Per project</RadioGroupItem>
          </RadioGroup>
        </div>
        <ViewDetailsLink href={detailsHref} />
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
