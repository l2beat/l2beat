import type { ProjectInclusionDelayChart as ProjectInclusionDelayChartConfig } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  getInclusionDelayChartData,
  getInclusionDelayEntityLegendEntries,
  getInclusionDelayThresholdMarkers,
  type InclusionDelayEntityLegendEntry,
} from './calculateInclusionDelay'
import {
  InclusionDelayChart,
  type InclusionDelayYAxisScale,
} from './InclusionDelayChart'

interface Props {
  chart: ProjectInclusionDelayChartConfig
  projectName: string
}

export function ProjectInclusionDelayChart({ chart, projectName }: Props) {
  const [yAxisScale, setYAxisScale] = useState<InclusionDelayYAxisScale>(
    'linear',
  )

  const data = useMemo(
    () =>
      getInclusionDelayChartData(chart).map((point) => ({
        ...point,
        timestamp: point.censoringFraction,
      })),
    [chart],
  )
  const entityLegendEntries = useMemo(
    () => getInclusionDelayEntityLegendEntries(chart),
    [chart],
  )
  const thresholdMarkers = useMemo(
    () => getInclusionDelayThresholdMarkers(chart),
    [chart],
  )
  const chartMeta = useMemo(
    () => getInclusionDelayChartMeta(projectName),
    [projectName],
  )

  const hasStakeDistribution = chart.stakeDistribution !== undefined

  return (
    <div className="my-6 flex flex-col">
      <ChartControlsWrapper className="justify-end">
        <RadioGroup
          name={`${projectName}-inclusion-delay-y-axis`}
          value={yAxisScale}
          onValueChange={(value) =>
            setYAxisScale(value as InclusionDelayYAxisScale)
          }
        >
          <RadioGroupItem value="linear">LIN</RadioGroupItem>
          <RadioGroupItem value="log">LOG</RadioGroupItem>
        </RadioGroup>
      </ChartControlsWrapper>
      <div className="mt-4 mb-3">
        <InclusionDelayChart
          data={data}
          chartMeta={chartMeta}
          maxCensorFraction={chart.maxCensorFraction}
          yAxisScale={yAxisScale}
          thresholdMarkers={thresholdMarkers}
          entityMarkers={entityLegendEntries.filter(hasFiniteDelay)}
          hasStakeDistribution={hasStakeDistribution}
        />
      </div>
      <EntityMarkersLegend
        entries={entityLegendEntries}
        hasStakeDistribution={hasStakeDistribution}
      />
    </div>
  )
}

function EntityMarkersLegend({
  entries,
  hasStakeDistribution,
}: {
  entries: InclusionDelayEntityLegendEntry[]
  hasStakeDistribution: boolean
}) {
  if (!hasStakeDistribution) return null

  return (
    <div className="mt-3 font-medium text-label-value-13">
      {entries.length > 0 ? (
        <div className="grid gap-x-6 gap-y-1.5 md:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="min-w-0 truncate"
              title={entry.entityNames.join(', ')}
            >
              <span className="text-primary">{entry.label}:</span>{' '}
              <span className="text-secondary">
                {formatEntityMarkerName(entry)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-fit rounded bg-warning/15 px-2 py-1 text-warning">
          No data about stake distribution among entities available
        </div>
      )}
    </div>
  )
}

function getInclusionDelayChartMeta(projectName: string) {
  return {
    projectDelayDays: {
      label: projectName,
      color: 'var(--chart-pink)',
      indicatorType: { shape: 'line' },
    },
    ethereumDelayDays: {
      label: 'Ethereum',
      color: 'var(--chart-ethereum)',
      indicatorType: { shape: 'line', strokeDasharray: '3 3' },
    },
  } satisfies ChartMeta
}

function hasFiniteDelay(
  entry: InclusionDelayEntityLegendEntry,
): entry is InclusionDelayEntityLegendEntry & { delayDays: number } {
  return entry.delayDays !== null
}

function formatEntityMarkerName(entry: InclusionDelayEntityLegendEntry) {
  return entry.entityNames.at(-1) ?? ''
}
