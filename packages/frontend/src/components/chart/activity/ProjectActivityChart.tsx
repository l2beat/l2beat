import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { formatNumber, UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { ActivityChartRangeControls } from '~/pages/layer2s/activity/components/ActivityChartRangeControls'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/layer2s/activity/components/ActivityMetricControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import { ChartInsight } from '../ChartInsight'
import { tvsRangeToReadable } from '../tvs/tvsRangeToReadable'
import type { ChartScale } from '../types'
import { ActivityChart, typeToColor } from './ActivityChart'
import { ActivityChartStatsPanel } from './ActivityChartStatsPanel'
import { ActivityRatioChart } from './ActivityRatioChart'
import { getChartType } from './utils/getChartType'

interface Props {
  milestones: Milestone[]
  project: ChartProject
  category?: ProjectScalingCategory
  defaultRange: ChartRange
}

export function ProjectActivityChart({
  milestones,
  project,
  category,
  defaultRange,
}: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  const [scale, setScale] = useState<ChartScale>('linear')

  const {
    data: chart,
    isLoading,
    isPlaceholderData,
    shownInput,
  } = useChartQuery(trpc.activity.chart, {
    range,
    filter: {
      type: 'projects',
      projectIds: [project.id],
    },
    hourly: true,
  })

  const type = getChartType(category)
  const resolution = chart?.resolution ?? 'day'

  const chartData = useMemo(() => {
    const resolutionSeconds = UnixTime.periodToSeconds(resolution)
    return chart?.data.map(
      ([timestamp, projectsTx, ethereumTx, projectsUops, ethereumUops]) => {
        const projectMetric = metric === 'tps' ? projectsTx : projectsUops
        const ethereumMetric = metric === 'tps' ? ethereumTx : ethereumUops
        return {
          timestamp,
          projects:
            projectMetric !== null ? projectMetric / resolutionSeconds : null,
          ethereum:
            ethereumMetric !== null ? ethereumMetric / resolutionSeconds : null,
        }
      },
    )
  }, [chart?.data, metric, resolution])

  const ratioData = useMemo(() => {
    return chart?.data.map(([timestamp, projectsTx, _, projectsUops]) => ({
      timestamp,
      ratio:
        projectsTx !== null && projectsUops !== null
          ? projectsTx === 0
            ? 1
            : projectsUops / projectsTx
          : null,
    }))
  }, [chart?.data])

  const timeRange = getChartTimeRangeFromData(chartData, { bucket: resolution })
  const syncedUntil = chart?.syncedUntil
  const totals = useMemo(() => {
    let project = 0
    let ethereum = 0
    // Only days both counts cover, so a project behind on syncing isn't
    // compared with Ethereum days it has no data for.
    for (const [
      timestamp,
      projectsTx,
      ethereumTx,
      projectsUops,
      ethereumUops,
    ] of chart?.data ?? []) {
      const projectCount = metric === 'tps' ? projectsTx : projectsUops
      const ethereumCount = metric === 'tps' ? ethereumTx : ethereumUops
      if (projectCount === null || ethereumCount === null) continue
      if (syncedUntil !== undefined && timestamp > syncedUntil) continue
      project += projectCount
      ethereum += ethereumCount
    }
    return { project, ethereum }
  }, [chart?.data, metric, syncedUntil])
  const projectName = project.shortName ?? project.name
  const countUnit = metric === 'tps' ? 'txs' : 'ops'
  return (
    <div className="flex flex-col">
      {(isLoading || totals.ethereum > 0) && (
        <ChartInsight
          className="mb-5"
          eyebrow={`${projectName} vs Ethereum · ${tvsRangeToReadable(shownInput.range)}`}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          headline={
            totals.ethereum > 0 &&
            activityHeadline(
              projectName,
              totals.project / totals.ethereum,
              metric === 'tps' ? 'transactions' : 'user operations',
            )
          }
          parts={[
            {
              label: projectName,
              value: totals.project,
              formattedValue: `${formatNumber(totals.project)} ${countUnit}`,
              color: typeToColor(type),
            },
            {
              label: 'Ethereum',
              value: totals.ethereum,
              formattedValue: `${formatNumber(totals.ethereum)} ${countUnit}`,
              color: 'var(--chart-ethereum)',
              // The light mode's Ethereum blue is too dark for black text.
              textClassName: 'text-white dark:text-black',
            },
          ]}
        />
      )}
      <ChartControlsWrapper>
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <ActivityChartRangeControls
          range={range}
          setRange={setRange}
          hourlyRanges={chart?.hasHourly === false ? 'disabled' : 'enabled'}
        />
      </ChartControlsWrapper>
      <div className="mt-4 mb-3">
        <ActivityChart
          isPlaceholderData={isPlaceholderData}
          data={chartData}
          milestones={milestones}
          scale={scale}
          metric={metric}
          isLoading={isLoading}
          syncedUntil={chart?.syncedUntil}
          type={type}
          project={project}
          tickCount={4}
          resolution={resolution}
        />
      </div>
      <div className="mb-2">
        <ActivityRatioChart
          isPlaceholderData={isPlaceholderData}
          data={ratioData}
          syncedUntil={chart?.syncedUntil}
          isLoading={isLoading}
          resolution={resolution}
        />
      </div>

      <div className="flex justify-between gap-4">
        <ActivityMetricControls
          value={metric}
          onValueChange={setMetric}
          projectChart
        />
        <RadioGroup
          name="activityChartScale"
          value={scale}
          onValueChange={(value) => setScale(value as ChartScale)}
        >
          <RadioGroupItem value="symlog">LOG</RadioGroupItem>
          <RadioGroupItem value="linear">LIN</RadioGroupItem>
        </RadioGroup>
      </div>
      <ActivityChartStatsPanel
        stats={chart?.stats}
        metric={metric}
        isLoading={isLoading}
      />
    </div>
  )
}

/** The larger of the two counts over the period, as a multiple of the other. */
function activityHeadline(name: string, ratio: number, noun: string) {
  if (ratio >= 1.1) {
    return (
      <>
        {name} processed <strong>{formatRatio(ratio)}×</strong> as many {noun}{' '}
        as Ethereum
      </>
    )
  }
  if (ratio <= 1 / 1.1) {
    return (
      <>
        Ethereum processed <strong>{formatRatio(1 / ratio)}×</strong> as many{' '}
        {noun} as {name}
      </>
    )
  }
  return `${name} processed about as many ${noun} as Ethereum`
}

function formatRatio(ratio: number) {
  if (ratio >= 1000) return formatNumber(ratio)
  return ratio >= 10 ? Math.round(ratio).toString() : ratio.toFixed(1)
}
