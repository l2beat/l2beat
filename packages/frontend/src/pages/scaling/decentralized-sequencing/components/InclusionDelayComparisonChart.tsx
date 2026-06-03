import { useMemo, useState } from 'react'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import { ChartTooltipWrapper } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import {
  formatCensoringFraction,
  formatDelayDays,
  InclusionDelayChart,
  type InclusionDelayChartDataPoint,
  type InclusionDelayYAxisScale,
} from '~/components/projects/sections/sequencing/InclusionDelayChart'
import type { ScalingDecentralizedSequencingEntry } from '~/server/features/scaling/decentralized-sequencing/getScalingDecentralizedSequencingEntries'

interface Props {
  entries: ScalingDecentralizedSequencingEntry[]
}

type ChartEntry = ScalingDecentralizedSequencingEntry & {
  inclusionDelay: NonNullable<
    ScalingDecentralizedSequencingEntry['inclusionDelay']
  >
}

const PROJECT_COLORS: Record<string, string> = {
  aztecnetwork: 'var(--chart-pink)',
  'polygon-pos': 'var(--chart-cyan)',
  gnosis: 'var(--chart-yellow)',
}

const ETHEREUM_DATA_KEY = 'ethereumDelayDays'

const FALLBACK_COLORS = [
  'var(--chart-fuchsia)',
  'var(--chart-sky)',
  'var(--chart-lime)',
  'var(--chart-orange)',
]

export function InclusionDelayComparisonChart({ entries }: Props) {
  const [yAxisScale, setYAxisScale] =
    useState<InclusionDelayYAxisScale>('linear')

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

  const { showAllSelected, dataKeys, toggleDataKey, toggleAllDataKeys } =
    useChartDataKeys(chartMeta)

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
          name="decentralized-sequencing-inclusion-delay-y-axis"
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
          interactiveLegend={{
            dataKeys,
            onItemClick: toggleDataKey,
          }}
          legend={
            <ChartLegendToggleAll
              showAllSelected={showAllSelected}
              onToggleAll={toggleAllDataKeys}
            />
          }
          tooltipContent={<InclusionDelayComparisonTooltip meta={chartMeta} />}
        />
      </div>
    </PrimaryCard>
  )
}

function getComparisonChartMeta(entries: ChartEntry[]): ChartMeta {
  return {
    ...Object.fromEntries(
      entries.map((entry, index) => [
        entry.slug,
        {
          label: entry.name,
          color: getProjectColor(entry.slug, index),
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

  return [...points.values()]
    .sort((a, b) => a.censoringFraction - b.censoringFraction)
    .map((point) => {
      for (const entry of entries) {
        point[entry.slug] ??= null
      }
      point[ETHEREUM_DATA_KEY] ??= null
      return point
    })
}

function InclusionDelayComparisonTooltip({
  payload,
  label: censoringFraction,
  meta,
}: CustomChartTooltipProps & { meta: ChartMeta }) {
  if (!payload || typeof censoringFraction !== 'number') return null

  const rows = payload.filter(
    (entry) => typeof entry.dataKey === 'string' && meta[entry.dataKey],
  )

  return (
    <ChartTooltipWrapper>
      <div className="flex w-64 flex-col gap-2 font-medium text-label-value-14">
        <div>
          {formatCensoringFraction(censoringFraction)} censoring incurs an
          inclusion delay of
        </div>
        <div className="flex flex-col gap-1">
          {rows.map((entry) => {
            const dataKey = `${entry.dataKey}`
            const item = meta[dataKey]
            if (!item) return null

            return (
              <div
                key={dataKey}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-secondary">{item.label}</span>
                </div>
                <span className="shrink-0 text-primary">
                  {formatTooltipDelay(entry.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function formatTooltipDelay(value: unknown) {
  if (value === null || value === undefined) return 'no inclusion'

  const days = Number(value)
  if (!Number.isFinite(days)) return 'no inclusion'

  return formatDelayDays(days)
}

function getProjectColor(slug: string, index: number) {
  return (
    PROJECT_COLORS[slug] ??
    FALLBACK_COLORS[index % FALLBACK_COLORS.length] ??
    'var(--chart-pink)'
  )
}
