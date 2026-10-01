import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { HomePrivacyData } from '~/server/features/home/getHomePrivacyData'
import { HOME_CHART_HEIGHT_CLASS } from '../homeStyles'
import type { HomeSparklineDataPoint } from './charts/HomeSparkline'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeDomainCard, HomeDomainSection, HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import { HomePrivacyDot } from './HomePrivacyDot'
import {
  HomeRankedChange,
  HomeRankedTable,
  HomeRankedValue,
} from './HomeRankedTable'

export function HomePrivacyCard({
  data,
  className,
}: {
  data: HomePrivacyData
  className?: string
}) {
  const tvlChartData = useMemo<HomeSparklineDataPoint[]>(
    () => data.tvl.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [data.tvl.chart],
  )

  const depositsChartData = useMemo<HomeSparklineDataPoint[]>(
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
    <HomeDomainCard title="Privacy" href="/privacy" className={className}>
      <HomeKpiRow>
        <HomeKpiTile
          label="Value locked"
          value={
            latestTvl != null ? formatCurrency(latestTvl, 'usd') : undefined
          }
          change={data.tvl.change}
          chart={
            <HomeSparkline
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
            <HomeSparkline
              className={HOME_CHART_HEIGHT_CLASS}
              data={depositsChartData}
              tooltipLabel="Deposited"
              formatValue={(value) => formatCurrency(value, 'usd')}
              tooltipDayRange
            />
          }
        />
      </HomeKpiRow>
      <HomeDomainSection title="Top protocols">
        <HomeRankedTable
          rows={data.topProtocols}
          columns={[
            {
              id: 'privacy',
              middle: true,
              cell: (protocol) => (
                <HomePrivacyDot adversaries={protocol.adversaries} />
              ),
            },
            {
              id: 'tvl',
              align: 'right',
              cell: (protocol) => (
                <HomeRankedValue label="TVL" value={protocol.tvl} />
              ),
            },
            {
              id: 'change',
              align: 'right',
              cell: (protocol) => (
                <HomeRankedChange change={protocol.tvlChange} />
              ),
            },
          ]}
        />
      </HomeDomainSection>
    </HomeDomainCard>
  )
}
