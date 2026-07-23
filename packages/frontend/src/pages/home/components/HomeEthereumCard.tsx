import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatBytes } from '~/utils/number-format/formatBytes'
import { HomeChart } from './charts/HomeChart'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import {
  HOME_CHART_SECTION_GRID_CLASS,
  HomeChartSection,
} from './HomeChartSection'
import { HomeStatValue } from './HomeStatValue'

interface Props {
  charts: HomeEthereumCharts
}

export function HomeEthereumCard({ charts }: Props) {
  const activityChartData = useMemo(
    () =>
      charts.activity.chart.map(([timestamp, uopsCount]) => ({
        timestamp,
        value: uopsCount !== null ? uopsCount / UnixTime.DAY : null,
      })),
    [charts.activity.chart],
  )

  const dataPostedChartData = useMemo(
    () =>
      charts.da.chart.map(([timestamp, value]) => ({
        timestamp,
        value,
      })),
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

  const pastDayUops = charts.activity.pastDayUops
  const trackedShare = charts.da.trackedShare
  const uopsChange = charts.activity.change
  const dataPostedChange = charts.da.change

  return (
    <HomeCard className="flex h-full flex-col pb-4 xl:py-4">
      <HomeCardHeader
        title="Ethereum"
        href="/data-availability/projects/ethereum/ethereum"
      />
      <HorizontalSeparator className="my-3" />
      <div className={HOME_CHART_SECTION_GRID_CLASS}>
        <HomeChartSection
          label="Data posted to blobs"
          stat={
            <HomeStatValue
              isLoading={false}
              value={
                totalPosted !== undefined ? formatBytes(totalPosted) : undefined
              }
              change={dataPostedChange}
            />
          }
          statFooter={
            trackedShare !== undefined ? (
              <span className="font-medium text-label-value-12 text-secondary tabular-nums">
                {formatPercent(trackedShare)} by layer 2s
              </span>
            ) : null
          }
        >
          <HomeChart
            data={dataPostedChartData}
            isLoading={false}
            color="ethereum"
            tooltipLabel="Data posted"
            formatValue={(value) => formatBytes(value)}
            syncedUntil={charts.da.syncedUntil}
            tooltipDayRange
          />
        </HomeChartSection>
        <HomeChartSection
          label="Activity"
          stat={
            <HomeStatValue
              isLoading={false}
              value={
                pastDayUops !== undefined
                  ? `${formatActivityCount(pastDayUops)} UOPS`
                  : undefined
              }
              change={uopsChange}
            />
          }
        >
          <HomeChart
            data={activityChartData}
            isLoading={false}
            color="ethereum"
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
