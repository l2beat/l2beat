import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import round from 'lodash/round'
import { useMemo, useState } from 'react'
import { Area, AreaChart } from 'recharts'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartRange } from '~/utils/range/range'

type Metric = 'absolute' | 'percentage' | 'projects'

const TITLES: Record<Metric, string> = {
  absolute: 'Value secured by prover',
  percentage: 'Share of value secured by prover',
  projects: 'Projects using each prover',
}

interface Point {
  values: Record<string, number | null>
  projectCounts: Record<string, number>
}

interface Props {
  /** In legend order */
  provers: { id: string; name: string }[]
  defaultRange: ChartRange
}

export function ZkCatalogTvsChart({ provers, defaultRange }: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<Metric>('absolute')
  const { data, isLoading } = useQuery(
    trpc.tvs.zkCatalogChart.queryOptions({ range }),
  )

  const pointsByTimestamp = useMemo(
    () =>
      new Map(
        data?.chart.map(
          ([timestamp, values, projectCounts]): [number, Point] => [
            timestamp,
            { values, projectCounts },
          ],
        ),
      ),
    [data],
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
      data?.chart.map(([timestamp, valuesByProver, projectCountByProver]) => {
        const point: { timestamp: number; [key: string]: number | null } = {
          timestamp,
        }
        const total = dataKeys.reduce<number>(
          (acc, key) => acc + (valuesByProver[key] ?? 0),
          0,
        )
        for (const id of Object.keys(chartMeta)) {
          const value = valuesByProver[id] ?? null
          point[id] =
            value === null
              ? null
              : metric === 'absolute'
                ? value
                : metric === 'projects'
                  ? (projectCountByProver[id] ?? 0)
                  : total === 0
                    ? 0
                    : round((value / total) * 100, 2)
        }
        return point
      }),
    [data, chartMeta, dataKeys, metric],
  )

  return (
    <PrimaryCard className="mb-4">
      <div className="mb-3">
        <h2 className="font-bold text-lg md:text-xl">{TITLES[metric]}</h2>
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
      >
        {/* Without right:1 the chart last point is not hoverable for some reason */}
        <AreaChart responsive data={chartData} margin={{ top: 20, right: 1 }}>
          <ChartLegendToggleAll
            showAllSelected={showAllSelected}
            onToggleAll={toggleAllDataKeys}
          />
          {Object.keys(chartMeta).map((id) => (
            <Area
              key={id}
              dataKey={id}
              stackId="a"
              hide={!dataKeys.includes(id)}
              fill={chartMeta[id]?.color}
              fillOpacity={1}
              strokeWidth={0}
              activeDot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            yAxis={
              metric === 'absolute'
                ? {
                    tickCount: 4,
                    tickFormatter: (value) =>
                      formatCurrency(Number(value), 'usd'),
                  }
                : metric === 'percentage'
                  ? {
                      unit: '%',
                      // To avoid showing 100.000001% we specify domain manually
                      domain: [0, 100],
                      allowDataOverflow: true,
                    }
                  : { tickCount: 4, allowDecimals: false }
            }
            syncedUntil={data?.syncedUntil}
          />
          <ChartTooltip
            filterNull={false}
            content={
              <CustomTooltip
                metric={metric}
                pointsByTimestamp={pointsByTimestamp}
              />
            }
          />
        </AreaChart>
      </ChartContainer>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <RadioGroup
          name="zkCatalogTvsMetric"
          value={metric}
          onValueChange={(value) => setMetric(value as Metric)}
        >
          <RadioGroupItem value="absolute">Absolute</RadioGroupItem>
          <RadioGroupItem value="percentage">Percentage</RadioGroupItem>
          <RadioGroupItem value="projects">Projects</RadioGroupItem>
        </RadioGroup>
        <TvsChartRangeControls range={range} setRange={setRange} />
      </div>
    </PrimaryCard>
  )
}

function CustomTooltip({
  payload,
  label,
  metric,
  pointsByTimestamp,
}: CustomChartTooltipProps & {
  metric: Metric
  pointsByTimestamp: Map<number, Point>
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  const point = pointsByTimestamp.get(label)
  const visible = payload
    .flatMap(({ name, type, hide }) => {
      const usd = name ? point?.values[name] : undefined
      const projects = name ? (point?.projectCounts[name] ?? 0) : 0
      const shown = metric === 'projects' ? projects : usd
      return name && shown && type !== 'none' && !hide
        ? [{ name, usd: usd ?? 0, projects }]
        : []
    })
    .sort((a, b) =>
      metric === 'projects' ? b.projects - a.projects : b.usd - a.usd,
    )
  const totalUsd = visible.reduce((acc, curr) => acc + curr.usd, 0)
  const totalProjects = visible.reduce((acc, curr) => acc + curr.projects, 0)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
        {metric !== 'percentage' && (
          <>
            <div className="mt-3 mb-1.5 flex items-center justify-between gap-2 text-heading-16">
              <span>Total</span>
              <span className="text-primary">
                {metric === 'absolute'
                  ? formatCurrency(totalUsd, 'usd')
                  : totalProjects}
              </span>
            </div>
            <HorizontalSeparator />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {visible.map(({ name, usd, projects }) => {
            const config = meta[name]
            if (!config) return null
            const usdText = formatCurrency(usd, 'usd')
            const shareText = formatPercent(totalUsd > 0 ? usd / totalUsd : 0)
            return (
              <div
                key={name}
                className="flex items-center justify-between gap-x-3"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="font-medium text-label-value-14">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 text-primary tabular-nums">
                  {metric === 'projects' ? (
                    projects
                  ) : (
                    <>
                      {metric === 'absolute' ? usdText : shareText}
                      <span className="text-secondary">
                        {' '}
                        ({metric === 'absolute' ? shareText : usdText})
                      </span>
                    </>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
