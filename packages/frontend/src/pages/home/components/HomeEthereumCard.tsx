import { formatActivityCount, formatBytes } from '@l2beat/shared-pure'
import { LiveIndicator } from '~/components/LiveIndicator'
import { env } from '~/env'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HOME_UNDERLINE_CLASS } from '../homeStyles'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import { HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'

/** Ethereum's blob data and activity, a chart pair like every other card's. */
export function HomeEthereumCard({
  charts,
  className,
}: {
  charts: HomeEthereumCharts
  className?: string
}) {
  const { activity, da } = charts
  return (
    // Beside the domain cards (`home-wide`) it takes their title and chart
    // rows, so its parts stay level with theirs.
    <HomeCard
      className={cn(
        'home-wide:row-span-2 flex home-wide:grid min-w-0 home-wide:grid-rows-subgrid flex-col gap-5 home-wide:gap-6',
        className,
      )}
    >
      <HomeCardHeader
        title="Ethereum"
        subtitle={env.CLIENT_SIDE_BLOBS_PAGE && <LiveBlobsLink />}
        link={{ href: ETHEREUM_PROJECT_PATH, label: 'Project page' }}
      />
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
              data={da.chart}
              tooltipLabel="Data posted"
              formatValue={(value) => formatBytes(value)}
              weeklyAverage
              perDay
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
              data={activity.chart}
              tooltipLabel="UOPS"
              formatValue={(value) => `${formatActivityCount(value)} UOPS`}
              weeklyAverage
            />
          }
        />
      </HomeKpiRow>
    </HomeCard>
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
