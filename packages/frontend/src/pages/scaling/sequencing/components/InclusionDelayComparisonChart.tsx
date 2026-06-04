import { useMemo, useState } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import {
  InclusionDelayChart,
  type InclusionDelayChartDataPoint,
  type InclusionDelayYAxisScale,
} from '~/components/projects/sections/sequencing/InclusionDelayChart'
import type { ScalingSequencingEntry } from '~/server/features/scaling/sequencing/getScalingSequencingEntries'
import { generateAccessibleColors } from '~/utils/generateColors'

interface Props {
  entries: ScalingSequencingEntry[]
}

type ChartEntry = ScalingSequencingEntry & {
  inclusionDelay: NonNullable<ScalingSequencingEntry['inclusionDelay']>
}

const ETHEREUM_DATA_KEY = 'ethereumDelayDays'

export function InclusionDelayComparisonChart({ entries }: Props) {
  const [yAxisScale, setYAxisScale] = useState<InclusionDelayYAxisScale>('log')

  const chartEntries = useMemo(
    () =>
      entries.filter(
        (entry): entry is ChartEntry => entry.inclusionDelay !== undefined,
      ),
    [entries],
  )

  const chartMeta = useMemo<ChartMeta>(
    () => getComparisonChartMeta(chartEntries),
    [chartEntries],
  )

  const chartData = useMemo(
    () => getComparisonChartData(chartEntries),
    [chartEntries],
  )

  const maxCensorFraction = Math.max(
    ...chartEntries.map((entry) => entry.inclusionDelay.maxCensorFraction),
    0,
  )

  if (chartEntries.length === 0) {
    return null
  }

  return (
    <PrimaryCard className="mt-4 md:mt-6">
      <ChartControlsWrapper>
        <div className="flex min-w-0 flex-col">
          <h2 className="font-bold text-heading-16 md:text-heading-20">
            Inclusion delay by censorship fraction
          </h2>
          <p className="text-paragraph-13 text-secondary md:text-paragraph-14">
            T99 inclusion delay in a static sequencer set by censoring fraction
            of sequencers/validators
          </p>
        </div>
        <RadioGroup
          name="scaling-sequencing-inclusion-delay-y-axis"
          value={yAxisScale}
          onValueChange={(value) =>
            setYAxisScale(value as InclusionDelayYAxisScale)
          }
        >
          <RadioGroupItem value="linear">LIN</RadioGroupItem>
          <RadioGroupItem value="log">LOG</RadioGroupItem>
        </RadioGroup>
      </ChartControlsWrapper>
      <div className="mt-4">
        <InclusionDelayChart
          data={chartData}
          chartMeta={chartMeta}
          maxCensorFraction={maxCensorFraction}
          yAxisScale={yAxisScale}
        />
      </div>
    </PrimaryCard>
  )
}

function getComparisonChartMeta(entries: ChartEntry[]): ChartMeta {
  const colors = generateAccessibleColors(entries.length)

  return {
    ...Object.fromEntries(
      entries.map((entry, index) => [
        entry.slug,
        {
          label: entry.name,
          color: colors[index] ?? 'var(--chart-pink)',
          indicatorType: { shape: 'line' as const },
        },
      ]),
    ),
    [ETHEREUM_DATA_KEY]: {
      label: 'Ethereum',
      color: 'var(--chart-ethereum)',
      indicatorType: { shape: 'line', strokeDasharray: '3 3' },
    },
  }
}

function getComparisonChartData(
  entries: ChartEntry[],
): InclusionDelayChartDataPoint[] {
  const points = new Map<number, InclusionDelayChartDataPoint>()

  for (const entry of entries) {
    for (const point of entry.inclusionDelay.chartData) {
      const existing = points.get(point.censoringFraction) ?? {
        timestamp: point.censoringFraction,
        censoringFraction: point.censoringFraction,
      }
      existing[entry.slug] = point.projectDelayDays
      existing[ETHEREUM_DATA_KEY] ??= point.ethereumDelayDays
      points.set(point.censoringFraction, existing)
    }
  }

  return [...points.values()].sort(
    (a, b) => a.censoringFraction - b.censoringFraction,
  )
}
