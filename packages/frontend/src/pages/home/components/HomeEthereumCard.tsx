import { formatActivityCount, formatBytes, UnixTime } from '@l2beat/shared-pure'
import { type ReactNode, useMemo } from 'react'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HOME_CHART_HEIGHT_CLASS } from '../homeStyles'
import type { HomeSparklineDataPoint } from './charts/HomeSparkline'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import { HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'

const ETHEREUM_HREF = '/data-availability/projects/ethereum/ethereum'

/** Ethereum's blob data and activity, a chart pair like every other card's. */
export function HomeEthereumCard({
  charts,
  className,
  children,
}: {
  charts: HomeEthereumCharts
  className?: string
  /** More of Ethereum, under the chart pair. */
  children?: ReactNode
}) {
  const activityChartData = useMemo<HomeSparklineDataPoint[]>(
    () =>
      charts.activity.chart.map(([timestamp, uopsCount]) => ({
        timestamp,
        value: uopsCount !== null ? uopsCount / UnixTime.DAY : null,
      })),
    [charts.activity.chart],
  )

  const dataPostedChartData = useMemo<HomeSparklineDataPoint[]>(
    () => charts.da.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [charts.da.chart],
  )

  const totalPosted = useMemo(
    () =>
      charts.da.chart.reduce<number | undefined>((acc, [, value]) => {
        if (value === null) return acc
        return (acc ?? 0) + value
      }, undefined),
    [charts.da.chart],
  )

  const { pastDayUops } = charts.activity
  const { trackedShare } = charts.da

  return (
    <HomeCard className={cn('flex min-w-0 flex-col gap-5', className)}>
      <HomeCardHeader title="Ethereum" href={ETHEREUM_HREF} />
      <HomeKpiRow>
        <HomeKpiTile
          label="Blob data"
          labelAccessory={
            trackedShare !== undefined &&
            `${formatPercent(trackedShare)} by L2s`
          }
          {...splitUnit(
            totalPosted !== undefined ? formatBytes(totalPosted) : undefined,
          )}
          change={charts.da.change}
          chart={
            <HomeSparkline
              data={dataPostedChartData}
              tooltipLabel="Data posted"
              formatValue={(value) => formatBytes(value)}
              weeklyAverage
              className={HOME_CHART_HEIGHT_CLASS}
            />
          }
        />
        <HomeKpiTile
          label="Activity/UOPS"
          value={
            pastDayUops !== undefined
              ? formatActivityCount(pastDayUops)
              : undefined
          }
          change={charts.activity.change}
          chart={
            <HomeSparkline
              data={activityChartData}
              tooltipLabel="UOPS"
              formatValue={(value) => `${formatActivityCount(value)} UOPS`}
              weeklyAverage
              className={HOME_CHART_HEIGHT_CLASS}
            />
          }
        />
      </HomeKpiRow>
      {children}
    </HomeCard>
  )
}

/** "1.39 TiB" → number and unit, so the tile can draw the unit smaller. */
function splitUnit(formatted: string | undefined): {
  value: string | undefined
  unit?: string
} {
  if (formatted === undefined) {
    return { value: undefined }
  }
  const at = formatted.lastIndexOf(' ')
  return at === -1
    ? { value: formatted }
    : { value: formatted.slice(0, at), unit: formatted.slice(at + 1) }
}
