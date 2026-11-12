import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { formatBytes, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { DaThroughputByProjectChart } from '~/components/chart/data-availability/DaThroughputByProjectChart'
import { getDataWithConfiguredThroughputs } from '~/components/chart/data-availability/getDataWithConfiguredThroughputs'
import { ProjectDaAbsoluteThroughputChart } from '~/components/chart/data-availability/ProjectDaAbsoluteThroughputChart'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import { optionToRange, rangeToResolution } from '~/utils/range/range'

export interface BlobsThroughputChartProps {
  project: ChartProject
  configuredThroughputs: DaLayerThroughput[]
  milestones: Milestone[]
  /** By project name */
  customColors: Record<string, string>
}

type View = 'total' | 'per-project'

export function BlobsThroughputChart({
  project,
  configuredThroughputs,
  milestones,
  customColors,
}: BlobsThroughputChartProps) {
  const trpc = useTRPC()
  const [view, setView] = useState<View>('total')
  // Kept for the life of the page, a new range every render would refetch
  const [range] = useState(() => optionToRange('1y'))
  const resolution = useMemo(() => rangeToResolution(range), [range])

  const params = {
    range,
    projectId: project.id,
    // Everything posted counts towards the capacity, not only what
    // scaling projects posted
    includeL2Only: false,
  }
  const total = useQuery(trpc.da.projectChart.queryOptions(params))
  // A year of every poster's hourly records, so it waits to be asked for
  const byProject = useQuery(
    trpc.da.projectCharts.queryOptions(params, {
      enabled: view === 'per-project',
    }),
  )
  const pastDay = useQuery(
    trpc.da.pastDayUsage.queryOptions({ daLayerId: project.id }),
  )

  const dataWithConfiguredThroughputs = getDataWithConfiguredThroughputs(
    total.data?.chart,
    configuredThroughputs,
    resolution,
  )

  return (
    <div className="flex flex-col gap-4 lg:contents">
      <Header
        used={pastDay.data?.used}
        day={pastDay.data?.day}
        isLoading={pastDay.isLoading}
        view={view}
        setView={setView}
      />
      {view === 'total' ? (
        <ProjectDaAbsoluteThroughputChart
          isPlaceholderData={false}
          project={project}
          dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
          isLoading={total.isLoading}
          milestones={milestones}
          syncedUntil={total.data?.syncedUntil}
          resolution={resolution}
          hideProjectLogo
          disableLegendOnboarding
        />
      ) : (
        <DaThroughputByProjectChart
          isPlaceholderData={false}
          data={byProject.data?.byProjectChart.data}
          syncedUntil={byProject.data?.syncedUntil}
          isLoading={byProject.isLoading}
          customColors={customColors}
          capacity={{
            projectId: project.id,
            data: dataWithConfiguredThroughputs,
          }}
          milestones={milestones}
          resolution={resolution}
          disableLegendOnboarding
        />
      )}
    </div>
  )
}

function Header({
  used,
  day,
  isLoading,
  view,
  setView,
}: {
  used: number | undefined
  day: [number, number] | undefined
  isLoading: boolean
  view: View
  setView: (view: View) => void
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-bold text-xl">Data Posted</span>
        <RadioGroup
          name="blobsThroughputView"
          value={view}
          onValueChange={(value) => setView(value as View)}
          className="h-7"
        >
          <RadioGroupItem value="total">Total</RadioGroupItem>
          <RadioGroupItem value="per-project">Per project</RadioGroupItem>
        </RadioGroup>
      </div>
      {isLoading ? (
        <Skeleton className="my-[5px] h-5 w-40" />
      ) : used === undefined || day === undefined ? (
        <span className="whitespace-nowrap font-bold text-xl">No data</span>
      ) : (
        // laid out as the TVS header is, so the two read alike
        <div className="flex flex-wrap items-baseline justify-end gap-x-1.5">
          <span className="whitespace-nowrap font-bold text-xl">
            {formatBytes(used)}
          </span>
          {/* Names its day, as the live total below is over the last 24h */}
          <span className="whitespace-nowrap text-secondary text-xs leading-none">
            {describePastDay(day)}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * One date, not a range, so it reads as the value's day rather than the
 * chart's span. A lagging indexer's 24 hours end mid-day, so they get a time.
 */
function describePastDay([from, to]: [number, number]): string {
  return from === UnixTime.toStartOf(from, 'day')
    ? `on ${formatTimestamp(from)}`
    : `in 24h to ${formatTimestamp(to, { mode: 'datetime' })}`
}
