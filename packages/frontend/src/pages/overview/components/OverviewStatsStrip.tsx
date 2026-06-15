import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { cn } from '~/utils/cn'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { OverviewProjectCounts } from '../getOverviewProjectCounts'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'
import {
  OVERVIEW_STAT_STRIP_GRID_CLASS,
  OVERVIEW_STAT_TILE_COUNT_CLASS,
  OVERVIEW_STAT_TILE_ICON_CLASS,
  OVERVIEW_STAT_TILE_INSET_CLASS,
  OVERVIEW_STAT_TILE_LABEL_CLASS,
  OVERVIEW_STAT_TILE_LINK_NARROW_CLASS,
  OVERVIEW_STAT_TILE_SUFFIX_CLASS,
} from './overviewResponsive'

interface Tile {
  label: string
  count: number
  href: string
  icon: React.ReactNode
  iconBgClassName: string
}

export function OverviewStatsStrip({
  counts,
  variant: _variant = 'default',
}: {
  counts: OverviewProjectCounts
  variant?: 'default' | 'overviewRightColumn'
}) {
  const tiles: Tile[] = [
    {
      label: 'Scaling',
      count: counts.scaling,
      href: '/scaling/summary',
      icon: <ScalingIcon className="size-5 stroke-pink-100" />,
      iconBgClassName: 'bg-pink-100/10',
    },
    {
      label: 'Interop',
      count: counts.interop,
      href: '/interop/summary',
      icon: <BridgesIcon className="size-5 stroke-orange-500" />,
      iconBgClassName: 'bg-orange-500/10',
    },
    {
      label: 'Privacy',
      count: counts.privacy,
      href: '/privacy',
      icon: <PrivacyIcon className="size-5 stroke-green-450" />,
      iconBgClassName: 'bg-green-450/10',
    },
    {
      label: 'Data Availability',
      count: counts.dataAvailability,
      href: '/data-availability/summary',
      icon: <DataAvailabilityIcon className="size-5 fill-blue-500" />,
      iconBgClassName: 'bg-blue-500/10',
    },
    {
      label: 'ZK Catalog',
      count: counts.zkCatalog,
      href: '/zk-catalog',
      icon: <ZkCatalogIcon className="size-5 stroke-purple-500" />,
      iconBgClassName: 'bg-purple-500/10',
    },
    {
      label: 'Ecosystems',
      count: counts.ecosystems,
      href: '/ecosystems/agglayer',
      icon: <EcosystemsIcon className="size-5 stroke-teal-500" />,
      iconBgClassName: 'bg-teal-500/10',
    },
  ]

  return (
    <PrimaryCard className={OVERVIEW_CARD_PADDING_CLASS}>
      <ul
        className={cn(
          OVERVIEW_STAT_STRIP_GRID_CLASS,
          'lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-divider',
        )}
      >
        {tiles.map((tile) => (
          <li key={tile.label}>
            <StatTile tile={tile} />
          </li>
        ))}
      </ul>
    </PrimaryCard>
  )
}

function StatTile({ tile }: { tile: Tile }) {
  const labelSuffix = tile.label === 'Interop' ? 'chains' : 'projects'
  return (
    <a
      href={tile.href}
      className={cn(
        'group flex h-full items-center transition-colors duration-200 hover:border-link-stroke hover:bg-surface-secondary',
        OVERVIEW_STAT_TILE_INSET_CLASS,
        OVERVIEW_STAT_TILE_LINK_NARROW_CLASS,
      )}
    >
      <div className={cn(OVERVIEW_STAT_TILE_ICON_CLASS, tile.iconBgClassName)}>
        {tile.icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center lg:flex-row lg:items-baseline lg:gap-2 min-[1536px]:lg:gap-2.5 min-[1700px]:lg:gap-3">
        <span className={OVERVIEW_STAT_TILE_LABEL_CLASS}>{tile.label}</span>
        <span className={OVERVIEW_STAT_TILE_COUNT_CLASS}>
          {formatInteger(tile.count)}
          <span className={OVERVIEW_STAT_TILE_SUFFIX_CLASS}>{labelSuffix}</span>
        </span>
      </div>
      <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
    </a>
  )
}
