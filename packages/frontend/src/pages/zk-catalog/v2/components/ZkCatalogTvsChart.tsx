import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import round from 'lodash/round'
import { useMemo, useState } from 'react'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartRange } from '~/utils/range/range'

type Metric = 'value' | 'projects'
type Unit = 'absolute' | 'percentage'

interface Point {
  values: Record<string, number | null>
  projectCounts: Record<string, number>
}

interface Row extends Point {
  timestamp: number
  /** Each prover's plotted amount, or its share in percent. */
  plotted: Record<string, number | null>
}

interface Props {
  /** In legend order */
  provers: { id: string; name: string }[]
  defaultRange: ChartRange
}

export function ZkCatalogTvsChart({ provers, defaultRange }: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<Metric>('value')
  const [unit, setUnit] = useState<Unit>('absolute')
  const { data, isLoading } = useQuery(
    trpc.tvs.zkCatalogChart.queryOptions({ range }),
  )

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [data],
  )

  const chartMeta = useMemo<ChartMeta>(() => {
    const charted = data?.chart[0]?.[1]
    if (!charted) return {}
    const chartedProvers = provers.filter((p) => p.id in charted)
    const colors = generateAccessibleColors(chartedProvers.length)
    return chartedProvers.reduce<ChartMeta>((acc, prover, index) => {
      acc[prover.id] = {
        label: prover.name,
        color: colors[index] ?? 'var(--secondary)',
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {})
  }, [data, provers])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, values, projectCounts]): Row => {
        const row: Row = { timestamp, values, projectCounts, plotted: {} }
        const total = dataKeys.reduce<number>(
          (acc, key) => acc + (getAmount(row, key, metric) ?? 0),
          0,
        )
        for (const id of Object.keys(chartMeta)) {
          const amount = getAmount(row, id, metric)
          row.plotted[id] =
            amount === null || unit === 'absolute'
              ? amount
              : total === 0
                ? 0
                : round((amount / total) * 100, 2)
        }
        return row
      }),
    [data, chartMeta, dataKeys, metric, unit],
  )

  return (
    <PrimaryCard className="mb-4">
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h2 className="font-bold text-lg md:text-xl">Prover adoption</h2>
          <RadioGroup
            name="zkCatalogProverMetric"
            value={metric}
            onValueChange={(value) => setMetric(value as Metric)}
            variant="highlighted"
            className="h-9"
          >
            <RadioGroupItem value="value" className="md:text-base">
              Value secured
            </RadioGroupItem>
            <RadioGroupItem value="projects" className="md:text-base">
              Projects
            </RadioGroupItem>
          </RadioGroup>
        </div>
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
        }}
        legend
        legendLeading={
          <ChartLegendToggleAll
            showAllSelected={showAllSelected}
            onToggleAll={toggleAllDataKeys}
          />
        }
      >
        <TimeSeriesChart
          data={chartData}
          ariaLabel="Prover adoption"
          series={Object.keys(chartMeta).map((id) => ({
            key: id,
            value: (row: Row) => row.plotted[id],
            stack: true,
            fill: chartMeta[id]?.color,
            activeDot: false,
          }))}
          yAxis={
            unit === 'percentage'
              ? {
                  unit: '%',
                  // To avoid showing 100.000001% we specify domain manually
                  domain: [0, 100],
                }
              : metric === 'value'
                ? {
                    tickCount: 4,
                    format: (value) => formatCurrency(value, 'usd'),
                  }
                : { tickCount: 4, integer: true }
          }
          // Project counts don't depend on TVS sync
          syncedUntil={metric === 'value' ? data?.syncedUntil : undefined}
          renderTooltip={(row, keys) => (
            <CustomTooltip row={row} keys={keys} metric={metric} unit={unit} />
          )}
        />
      </ChartContainer>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <RadioGroup
          name="zkCatalogProverUnit"
          value={unit}
          onValueChange={(value) => setUnit(value as Unit)}
        >
          <RadioGroupItem value="absolute">Absolute</RadioGroupItem>
          <RadioGroupItem value="percentage">Percentage</RadioGroupItem>
        </RadioGroup>
        <TvsChartRangeControls range={range} setRange={setRange} />
      </div>
    </PrimaryCard>
  )
}

/** Null when there is nothing to stack, so the prover's area is absent */
function getAmount(point: Point, proverId: string, metric: Metric) {
  if (metric === 'value') return point.values[proverId] ?? null
  return point.projectCounts[proverId] || null
}

function CustomTooltip({
  row,
  keys,
  metric,
  unit,
}: {
  row: Row
  keys: string[]
  metric: Metric
  unit: Unit
}) {
  const label = row.timestamp
  const visible = keys
    .flatMap((name) => {
      const amount = getAmount(row, name, metric)
      return amount ? [{ name, amount }] : []
    })
    .sort((a, b) => b.amount - a.amount)
  const total = visible.reduce((acc, curr) => acc + curr.amount, 0)
  const format = (amount: number) =>
    metric === 'value' ? formatCurrency(amount, 'usd') : amount.toString()

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { mode: 'datetime' })}
        </div>
        {unit === 'absolute' && (
          <>
            <div className="mt-3 mb-1.5 flex items-center justify-between gap-2 text-heading-16">
              <span>Total</span>
              <span className="text-primary">{format(total)}</span>
            </div>
            <HorizontalSeparator />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {visible.map(({ name, amount }) => {
            const amountText = format(amount)
            const shareText = formatPercent(total > 0 ? amount / total : 0)
            return (
              <ChartTooltipRow
                key={name}
                name={name}
                gap="gap-x-3"
                wrapLabel={false}
              >
                <span className="whitespace-nowrap font-medium text-label-value-15 text-primary tabular-nums">
                  {unit === 'absolute' ? amountText : shareText}
                  <span className="text-secondary">
                    {' '}
                    ({unit === 'absolute' ? shareText : amountText})
                  </span>
                </span>
              </ChartTooltipRow>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
