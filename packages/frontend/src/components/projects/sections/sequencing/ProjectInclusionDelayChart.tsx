import { useMemo, useState } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import type {
  InclusionDelayChartProps,
  InclusionDelayEntityLegendEntry,
  InclusionDelayEntityMarker,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'
import {
  InclusionDelayChart,
  type InclusionDelayYAxisScale,
} from './InclusionDelayChart'

interface Props extends InclusionDelayChartProps {
  projectName: string
}

export function ProjectInclusionDelayChart({
  projectName,
  chartData,
  entityLegendEntries,
  thresholdMarkers,
  maxCensorFraction,
}: Props) {
  const [yAxisScale, setYAxisScale] =
    useState<InclusionDelayYAxisScale>('linear')

  const data = useMemo(
    () =>
      chartData.map((point) => ({
        ...point,
        timestamp: point.censoringFraction,
      })),
    [chartData],
  )
  const chartMeta = getInclusionDelayChartMeta(projectName)

  return (
    <div className="my-6 flex flex-col">
      <div className="mt-4 mb-3">
        <InclusionDelayChart
          data={data}
          chartMeta={chartMeta}
          maxCensorFraction={maxCensorFraction}
          yAxisScale={yAxisScale}
          thresholdMarkers={thresholdMarkers}
          entityMarkers={entityLegendEntries.filter(hasFiniteDelay)}
        />
      </div>
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
      <EntityMarkersLegend entries={entityLegendEntries} />
    </div>
  )
}

function EntityMarkersLegend({
  entries,
}: {
  entries: InclusionDelayEntityLegendEntry[]
}) {
  if (entries.length === 0) {
    return (
      <div className="mt-3 w-fit rounded bg-warning/15 px-2 py-1 font-medium text-label-value-13 text-warning">
        No data about stake distribution among entities available
      </div>
    )
  }

  return (
    <div className="mt-3 grid gap-x-6 gap-y-1.5 font-medium text-label-value-13 md:grid-cols-2">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="min-w-0 truncate"
          title={entry.entityNames.join(', ')}
        >
          <span className="text-primary">{entry.label}:</span>{' '}
          <span className="text-secondary">
            {index > 0 ? '+' : ''}
            {formatEntityMarkerName(entry)}
          </span>
        </div>
      ))}
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
): entry is InclusionDelayEntityMarker {
  return entry.delayDays !== null
}

function formatEntityMarkerName(entry: InclusionDelayEntityLegendEntry) {
  return entry.entityNames.at(-1) ?? ''
}
