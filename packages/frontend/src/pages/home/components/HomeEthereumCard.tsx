import {
  formatActivityCount,
  formatBytes,
  formatNumber,
} from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { LiveIndicator } from '~/components/LiveIndicator'
import { env } from '~/env'
import { EthereumIcon } from '~/icons/pages/Ethereum'
import { formatYield } from '~/pages/defi/liquid-staking/formatLiquidStaking'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeLiquidStaking } from '~/server/features/home/getHomeLiquidStaking'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HOME_UNDERLINE_CLASS } from '../homeStyles'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import { HOME_KPI_GRID_CLASS, HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import { HomeRankedTable, HomeRankedValue } from './HomeRankedTable'

const LIQUID_STAKING_PATH = '/defi/liquid-staking'

/**
 * Ethereum's blob data and activity, a chart pair like every other card's,
 * and with the DeFi pages on, the ETH staked beside the liquid staking
 * protocols' ranking.
 */
export function HomeEthereumCard({
  charts,
  liquidStaking,
  className,
}: {
  charts: HomeEthereumCharts
  /** Absent while the DeFi pages it links to are off. */
  liquidStaking: HomeLiquidStaking | undefined
  className?: string
}) {
  const { activity, da } = charts
  const tiles = (
    <>
      <HomeKpiTile
        label="Blob data"
        labelAccessory={
          da.trackedShare !== undefined &&
          `${formatPercent(da.trackedShare)} by L2s`
        }
        {...splitUnit(
          da.value !== undefined ? formatBytes(da.value) : undefined,
        )}
        change={da.change}
        chart={
          <HomeSparkline
            label="Blob data"
            series={da.chart}
            formatValue={(value) => formatBytes(value)}
          />
        }
      />
      <HomeKpiTile
        label="Activity/UOPS"
        value={
          activity.value !== undefined
            ? formatActivityCount(activity.value)
            : undefined
        }
        change={activity.change}
        chart={
          <HomeSparkline
            label="Activity/UOPS"
            series={activity.chart}
            formatValue={(value) => `${formatActivityCount(value)} UOPS`}
          />
        }
      />
    </>
  )
  return (
    // Beside the domain cards (`home-wide`) it takes their rows, its title
    // level with theirs and its charts, one under the other, down to the
    // foot of their rankings.
    <HomeCard
      className={cn(
        'home-wide:row-span-3 flex home-wide:grid min-w-0 home-wide:grid-rows-subgrid flex-col gap-5 home-wide:[&>:nth-child(2)]:row-span-2',
        className,
      )}
    >
      <HomeCardHeader
        title="Ethereum"
        icon={<EthereumIcon aria-hidden />}
        subtitle={env.CLIENT_SIDE_BLOBS_PAGE && <LiveBlobsLink />}
        link={{ href: ETHEREUM_PROJECT_PATH, label: 'Project page' }}
      />
      {liquidStaking ? (
        <KpisWithLiquidStaking tiles={tiles} liquidStaking={liquidStaking} />
      ) : (
        <HomeKpiRow>{tiles}</HomeKpiRow>
      )}
    </HomeCard>
  )
}

/**
 * The KPIs two by two, the ranking in the last cell beside the ETH staked;
 * as rows, the ranking under them. Beside the domain cards (`home-wide`) the
 * KPIs are compact rows that fill their KPI row, and the ranking sits level
 * with their rankings.
 */
function KpisWithLiquidStaking({
  tiles,
  liquidStaking,
}: {
  tiles: ReactNode
  liquidStaking: HomeLiquidStaking
}) {
  const { ethStaked, protocols } = liquidStaking
  return (
    // A size container cannot be a subgrid: beside the domain cards the
    // tiles' own box is the container instead.
    <div className="@container/kpis-rows home-wide:grid min-w-0 home-wide:grid-rows-subgrid home-wide:[container-type:normal]">
      <div
        className={cn(
          HOME_KPI_GRID_CLASS,
          'home-wide:row-span-2 home-wide:grid-cols-1 home-wide:grid-rows-subgrid',
        )}
      >
        <div className="home-wide:@container/kpis-rows home-wide:grid contents home-wide:grid-cols-[minmax(9.5rem,auto)_minmax(0,1fr)] home-wide:gap-x-4 home-wide:gap-y-3">
          {tiles}
          <HomeKpiTile
            label="ETH staked"
            value={
              ethStaked.value !== undefined
                ? formatNumber(ethStaked.value)
                : undefined
            }
            unit="ETH"
            unitInLabel
            change={ethStaked.change}
            chart={
              <HomeSparkline
                label="ETH staked"
                series={ethStaked.chart}
                formatValue={(value) => `${formatNumber(value)} ETH`}
              />
            }
          />
        </div>
        {/* 24px above it like the domains' rankings. */}
        <div className="kpi-rows:col-span-2 home-wide:mt-1 min-w-0">
          <HomeRankedTable
            title={
              <a
                href={LIQUID_STAKING_PATH}
                className={cn('hover:decoration-current', HOME_UNDERLINE_CLASS)}
              >
                Liquid staking
              </a>
            }
            rows={protocols}
            columns={[
              {
                id: 'share',
                header: 'Share',
                align: 'right',
                cell: (protocol) => (
                  <HomeRankedValue
                    value={protocol.stakedEthShare}
                    format={formatPercent}
                  />
                ),
              },
              {
                id: 'yield',
                header: 'Yield',
                align: 'right',
                cell: (protocol) => (
                  <HomeRankedValue
                    value={protocol.yield}
                    format={(value) => formatYield(value)}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

/** Where the blobs behind these figures land, block by block. */
function LiveBlobsLink() {
  return (
    <a
      href="/blobs"
      className={cn(
        'inline-flex items-center gap-1.5 hover:text-primary hover:decoration-current',
        HOME_UNDERLINE_CLASS,
      )}
    >
      <LiveIndicator />
      Blobs live
    </a>
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
