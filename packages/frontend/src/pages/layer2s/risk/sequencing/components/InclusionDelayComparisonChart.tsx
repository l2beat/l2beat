import { useMemo, useState } from 'react'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import {
  InclusionDelayChart,
  type InclusionDelayYAxisScale,
} from '~/components/projects/sections/sequencing/InclusionDelayChart'
import type {
  InclusionDelayComparison,
  InclusionDelayComparisonSeries,
} from '~/server/features/layer2s/risks/sequencing/getLayer2sRiskSequencingEntries'
import { generateAccessibleColors } from '~/utils/generateColors'

interface Props {
  comparison: InclusionDelayComparison
}

export function InclusionDelayComparisonChart({ comparison }: Props) {
  const [yAxisScale, setYAxisScale] = useState<InclusionDelayYAxisScale>('log')

  const chartMeta = useMemo<ChartMeta>(
    () => getComparisonChartMeta(comparison.series),
    [comparison.series],
  )

  return (
    <PrimaryCard className="border-divider max-md:border-t md:mt-6">
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
          name="layer2s-sequencing-inclusion-delay-y-axis"
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
          data={comparison.data}
          chartMeta={chartMeta}
          maxCensorFraction={comparison.maxCensorFraction}
          yAxisScale={yAxisScale}
        />
      </div>
      <p className="mt-3 text-paragraph-13 text-secondary md:text-paragraph-14">
        A line stopping before the 50% limit indicates that any more censorship
        will prevent inclusion completely. This is usually due to the sequencer
        network's consensus mechanism stopping block production at that
        threshold.
      </p>
    </PrimaryCard>
  )
}

function getComparisonChartMeta(
  series: InclusionDelayComparisonSeries[],
): ChartMeta {
  const projectColors = generateAccessibleColors(
    series.filter((entry) => entry.type === 'project').length,
  )

  let projectIndex = 0
  return Object.fromEntries(
    series.map((entry) => {
      if (entry.type === 'ethereum') {
        return [
          entry.key,
          {
            label: entry.label,
            color: 'var(--chart-ethereum)',
            indicatorType: { shape: 'line', strokeDasharray: '3 3' },
          },
        ]
      }

      const color = projectColors[projectIndex++] ?? 'var(--chart-pink)'
      return [
        entry.key,
        {
          label: entry.label,
          color,
          indicatorType: { shape: 'line' as const },
        },
      ]
    }),
  )
}
