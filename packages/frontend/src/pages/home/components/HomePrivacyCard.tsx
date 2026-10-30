import { formatCurrency } from '@l2beat/shared-pure'
import { PrivacyRosetteCell } from '~/pages/privacy/rosette/PrivacyRosetteCell'
import type { HomePrivacyData } from '~/server/features/home/getHomePrivacyData'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeDomainCard, HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import {
  HomeRankedTable,
  HomeRankedValue,
  HomeRankedValueWithChange,
} from './HomeRankedTable'

export function HomePrivacyCard({
  data,
  projectCount,
}: {
  data: HomePrivacyData
  /** Every privacy project we track, for the link under the ranking. */
  projectCount: number
}) {
  const { tvl, deposits } = data
  return (
    <HomeDomainCard
      title="Privacy"
      link={{ href: '/privacy', label: `All ${projectCount} projects` }}
    >
      <HomeKpiRow>
        <HomeKpiTile
          label="Value locked"
          value={
            tvl.value !== undefined
              ? formatCurrency(tvl.value, 'usd')
              : undefined
          }
          change={tvl.change}
          chart={
            <HomeSparkline
              data={tvl.chart}
              tooltipLabel="Value locked"
              formatValue={(value) => formatCurrency(value, 'usd')}
            />
          }
        />
        <HomeKpiTile
          label="Deposits"
          value={
            deposits.value !== undefined
              ? formatCurrency(deposits.value, 'usd')
              : undefined
          }
          change={deposits.change}
          chart={
            <HomeSparkline
              data={deposits.chart}
              tooltipLabel="Deposited"
              formatValue={(value) => formatCurrency(value, 'usd')}
              weeklyAverage
              perDay
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
              <PrivacyRosetteCell
                adversaries={protocol.adversaries}
                href={protocol.href}
                isUnderReview={protocol.isUnderReview}
                iconClassName="md:size-6"
              />
            ),
          },
          {
            id: 'tvl',
            header: 'TVL',
            align: 'right',
            withChange: true,
            cell: (protocol) => (
              <HomeRankedValueWithChange
                value={protocol.tvl}
                change={protocol.tvlChange}
              />
            ),
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
