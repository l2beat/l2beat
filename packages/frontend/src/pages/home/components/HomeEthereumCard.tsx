import { formatActivityCount, formatBytes } from '@l2beat/shared-pure'
import { LiveIndicator } from '~/components/LiveIndicator'
import { env } from '~/env'
import { EthereumIcon } from '~/icons/pages/Ethereum'
import { formatYield } from '~/pages/defi/liquid-staking/formatLiquidStaking'
import { formatEthStaked } from '~/pages/defi/liquid-staking/liquidStakingMetrics'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeLiquidStaking } from '~/server/features/home/getHomeLiquidStaking'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HOME_UNDERLINE_CLASS } from '../homeStyles'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import { HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import { HomeRankedTable, HomeRankedValue } from './HomeRankedTable'

/**
 * Across the page: Ethereum's blob data and activity on the left, a pair of
 * tiles like every other card's; on the right a third tile, its stake, with
 * the liquid staking ranking beside it. Side by side once each half holds a
 * pair at their usual size (2 × 496px and the gap); stacked below.
 */
export function HomeEthereumCard({
  charts,
  liquidStaking,
  className,
}: {
  charts: HomeEthereumCharts
  liquidStaking: HomeLiquidStaking
  className?: string
}) {
  const { activity, da } = charts
  const hasLiquidStaking =
    liquidStaking.ethStaked.value !== undefined ||
    liquidStaking.protocols.length > 0
  return (
    <HomeCard className={cn('flex min-w-0 flex-col gap-5', className)}>
      <HomeCardHeader
        title="Ethereum"
        icon={<EthereumIcon aria-hidden />}
        subtitle={env.CLIENT_SIDE_BLOBS_PAGE && <LiveBlobsLink />}
        link={{ href: ETHEREUM_PROJECT_PATH, label: 'Project page' }}
      />
      <div className="@container/ethereum min-w-0">
        <div
          className={cn(
            'grid grid-cols-1 gap-y-8',
            hasLiquidStaking &&
              '@min-[1040px]/ethereum:grid-cols-2 @min-[1040px]/ethereum:gap-x-12',
          )}
        >
          <HomeKpiRow>
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
          </HomeKpiRow>
          {hasLiquidStaking && <HomeStaking data={liquidStaking} />}
        </div>
      </div>
    </HomeCard>
  )
}

/**
 * ETH staked as a tile like the ones beside it, and next to it, in the
 * pair's second place, the liquid staking protocols ranked by TVL with each
 * one's share of all stake, under a link to the full list.
 */
function HomeStaking({ data }: { data: HomeLiquidStaking }) {
  const { ethStaked, protocols } = data
  const rows = protocols.map((protocol) => ({
    ...protocol,
    name: protocol.shortName ?? protocol.name,
  }))

  return (
    // A pair like Blob data and Activity, so the tile is their size. Where
    // the pair stacks, the ranking takes the full row under the tile. Top
    // aligned, so the taller ranking does not stretch the tile and push its
    // chart below the others'.
    <HomeKpiRow className="items-start">
      <HomeKpiTile
        label="ETH staked"
        {...splitUnit(
          ethStaked.value !== undefined
            ? formatEthStaked(ethStaked.value)
            : undefined,
        )}
        change={ethStaked.change}
        chart={
          <HomeSparkline
            label="ETH staked"
            series={ethStaked.chart}
            formatValue={formatEthStaked}
          />
        }
      />
      {rows.length > 0 && (
        <div className="kpi-rows:col-span-2 min-w-0">
          <HomeRankedTable
            title={
              <a
                href="/defi/liquid-staking"
                className={cn(
                  'hover:text-primary hover:decoration-current',
                  HOME_UNDERLINE_CLASS,
                )}
              >
                Liquid staking
              </a>
            }
            rows={rows}
            columns={[
              {
                id: 'share',
                header: 'Share',
                align: 'right',
                cell: (protocol) => (
                  <HomeRankedValue
                    value={protocol.stakeShare}
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
                    format={formatYield}
                  />
                ),
              },
              {
                id: 'tvl',
                header: 'TVL',
                align: 'right',
                minTableWidth: 480,
                cell: (protocol) => (
                  <HomeRankedValue value={protocol.totalValueLockedUsd} />
                ),
              },
            ]}
          />
        </div>
      )}
    </HomeKpiRow>
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
