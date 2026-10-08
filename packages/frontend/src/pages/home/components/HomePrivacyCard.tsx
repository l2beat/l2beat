import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { HomePrivacyData } from '~/server/features/home/getHomePrivacyData'
import { HOME_CHART_HEIGHT_CLASS } from '../homeStyles'
import type { HomeKpiChartDataPoint } from './charts/HomeKpiChart'
import { HomeKpiChart } from './charts/HomeKpiChart'
import { HomeDomainCard, HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import { HomePrivacyDot } from './HomePrivacyDot'
import { HomeRankedTable, HomeRankedValue } from './HomeRankedTable'

export function HomePrivacyCard({
  data,
  projectCount,
  className,
}: {
  data: HomePrivacyData
  /** Every privacy project we track, for the link under the ranking. */
  projectCount: number
  className?: string
}) {
  const tvlChartData = useMemo<HomeKpiChartDataPoint[]>(
    () => data.tvl.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [data.tvl.chart],
  )

  const depositsChartData = useMemo<HomeKpiChartDataPoint[]>(
    () =>
      data.deposits.chart.map(([timestamp, , valueUsd]) => ({
        timestamp,
        value: valueUsd,
      })),
    [data.deposits.chart],
  )

  const latestTvl = tvlChartData.findLast((d) => d.value !== null)?.value
  const hasDeposits = data.deposits.chart.length > 0

  return (
    <HomeDomainCard
      title="Privacy"
      href="/privacy"
      viewAll={{
        href: '/privacy',
        label: `View all ${projectCount} privacy projects`,
      }}
      className={className}
    >
      <HomeKpiRow>
        <HomeKpiTile
          label="Value locked"
          value={
            latestTvl != null ? formatCurrency(latestTvl, 'usd') : undefined
          }
          change={data.tvl.change}
          chart={
            <HomeKpiChart
              className={HOME_CHART_HEIGHT_CLASS}
              data={tvlChartData}
              tooltipLabel="Value locked"
              formatValue={(value) => formatCurrency(value, 'usd')}
            />
          }
        />
        <HomeKpiTile
          label="Deposits"
          value={
            hasDeposits
              ? formatCurrency(data.deposits.totalValueUsd, 'usd')
              : undefined
          }
          change={data.deposits.change}
          chart={
            <HomeKpiChart
              className={HOME_CHART_HEIGHT_CLASS}
              data={depositsChartData}
              tooltipLabel="Deposited"
              formatValue={(value) => formatCurrency(value, 'usd')}
              weeklyAverage
            />
          }
        />
      </HomeKpiRow>
      <HomeRankedTable
        title="Top protocols"
        rows={data.topProtocols}
        columns={[
          {
            id: 'privacy',
            header: 'Privacy',
            middle: true,
            cell: (protocol) => (
              <HomePrivacyDot adversaries={protocol.adversaries} />
            ),
          },
          {
            id: 'tvl',
            header: 'TVL',
            align: 'right',
            cell: (protocol) => <HomeRankedValue value={protocol.tvl} />,
          },
          {
            id: 'deposited30d',
            header: 'Vol 30d',
            align: 'right',
            minTableWidth: 480,
            cell: (protocol) => (
              <HomeRankedValue value={protocol.deposited30d} />
            ),
          },
        ]}
      />
    </HomeDomainCard>
  )
}
