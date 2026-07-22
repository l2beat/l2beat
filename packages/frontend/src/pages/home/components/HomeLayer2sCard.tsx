import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { HomeLayer2sCharts } from '~/server/features/home/getHomeLayer2sCharts'
import { cn } from '~/utils/cn'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { HomeSparklineDataPoint } from './charts/HomeSparkline'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import {
  HOME_CHART_SECTION_GRID_CLASS,
  HomeChartSection,
} from './HomeChartSection'
import { HomeStatValue } from './HomeStatValue'

interface Props {
  charts: HomeLayer2sCharts
  layer2sCategoryCounts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
}

export function HomeLayer2sCard({ charts, layer2sCategoryCounts }: Props) {
  const tvsChartData = useMemo<HomeSparklineDataPoint[]>(
    () =>
      charts.tvs.chart.map(([timestamp, rollups, validiumsAndOptimiums]) => {
        const hasAny = rollups !== null || validiumsAndOptimiums !== null
        const total = (rollups ?? 0) + (validiumsAndOptimiums ?? 0)
        return {
          timestamp,
          value: hasAny ? total : null,
          tvsBreakdown: {
            rollups,
            validiumsAndOptimiums,
          },
        }
      }),
    [charts.tvs.chart],
  )

  const latestTvs = useMemo(
    () => tvsChartData.findLast((d) => d.value !== null)?.value ?? undefined,
    [tvsChartData],
  )

  const activitySparkline = useMemo(
    () =>
      charts.activity.chart.map(([timestamp, rollupsUops, vAndOUops]) => {
        const hasAny = rollupsUops !== null || vAndOUops !== null
        const sum = (rollupsUops ?? 0) + (vAndOUops ?? 0)
        return {
          timestamp,
          value: hasAny ? sum / UnixTime.DAY : null,
        }
      }),
    [charts.activity.chart],
  )

  const pastDayActivityUops = useMemo(() => {
    const last = [...activitySparkline].reverse().find((d) => d.value !== null)
    return last?.value ?? undefined
  }, [activitySparkline])

  return (
    <HomeCard className="flex h-full flex-col pb-4 xl:py-4">
      <div className="flex flex-col gap-2.5">
        <HomeCardHeader title="Layer 2s" href="/layer2s/summary" />
        <CountsLine counts={layer2sCategoryCounts} />
      </div>
      <HorizontalSeparator className="my-3" />
      <div className={HOME_CHART_SECTION_GRID_CLASS}>
        <HomeChartSection
          label="Total value secured"
          stat={
            <HomeStatValue
              isLoading={false}
              value={
                latestTvs !== undefined
                  ? formatCurrency(latestTvs, 'usd')
                  : undefined
              }
              change={charts.tvs.change}
            />
          }
        >
          <HomeSparkline
            data={tvsChartData}
            isLoading={false}
            color="pink"
            tooltipLabel="Total value secured"
            formatValue={(value) => formatCurrency(value, 'usd')}
            syncedUntil={charts.tvs.syncedUntil}
          />
        </HomeChartSection>
        <HomeChartSection
          label="Activity"
          stat={
            <HomeStatValue
              isLoading={false}
              value={
                pastDayActivityUops !== undefined
                  ? `${formatActivityCount(pastDayActivityUops)} UOPS`
                  : undefined
              }
              change={charts.activity.change}
            />
          }
        >
          <HomeSparkline
            data={activitySparkline}
            isLoading={false}
            color="cyan"
            tooltipLabel="UOPS"
            formatValue={(value) => formatActivityCount(value)}
            yAxisUnit=" UOPS"
            syncedUntil={charts.activity.syncedUntil}
            tooltipDayRange
          />
        </HomeChartSection>
      </div>
    </HomeCard>
  )
}

function CountsLine({
  counts,
}: {
  counts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
}) {
  const items = [
    { label: 'Rollups', value: counts.rollups, dot: 'bg-pink-100' },
    {
      label: 'Validiums & Optimiums',
      value: counts.validiumsAndOptimiums,
      dot: 'bg-blue-500',
    },
  ]

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 font-medium text-label-value-12">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className={cn('size-2 rounded-full', item.dot)} />
          <span className="tabular-nums">{formatInteger(item.value)}</span>
          <span className="text-secondary">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
