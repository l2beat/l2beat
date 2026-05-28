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

interface Tile {
  label: string
  count: number
  href: string
  icon: React.ReactNode
  iconBgClassName: string
}

export function OverviewStatsStrip({
  counts,
  variant = 'default',
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

  const narrow = variant === 'overviewRightColumn'

  return (
    <PrimaryCard className={OVERVIEW_CARD_PADDING_CLASS}>
      <ul
        className={cn(
          'grid grid-cols-2 gap-2 md:grid-cols-3',
          narrow
            ? 'lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-divider'
            : 'lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-divider',
        )}
      >
        {tiles.map((tile) => (
          <li key={tile.label}>
            <StatTile tile={tile} narrow={narrow} />
          </li>
        ))}
      </ul>
    </PrimaryCard>
  )
}

function StatTile({ tile, narrow }: { tile: Tile; narrow: boolean }) {
  const labelSuffix = tile.label === 'Interop' ? 'chains' : 'projects'
  return (
    <a
      href={tile.href}
      className={cn(
        'group flex h-full items-center gap-2.5 rounded-lg border border-divider px-2.5 py-2',
        'transition-colors duration-200 hover:border-link-stroke hover:bg-surface-secondary',
        narrow
          ? 'lg:-mx-3 lg:gap-2 lg:rounded-md lg:border-0 lg:px-3 lg:py-1.5 lg:hover:border-transparent'
          : 'lg:-mx-3 lg:gap-2 lg:rounded-md lg:border-0 lg:px-3 lg:py-1.5 lg:hover:border-transparent',
      )}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md',
          narrow
            ? 'lg:size-6 lg:rounded [&>svg]:lg:size-3.5'
            : 'lg:size-6 lg:rounded [&>svg]:lg:size-3.5',
          tile.iconBgClassName,
        )}
      >
        {tile.icon}
      </div>
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col justify-center',
          narrow
            ? 'lg:flex-row lg:items-baseline lg:gap-2'
            : 'lg:flex-row lg:items-baseline lg:gap-2',
        )}
      >
        <span
          className={cn(
            'truncate font-medium text-label-value-12 text-secondary leading-tight',
            narrow
              ? 'lg:flex-1 lg:text-label-value-13 lg:text-primary'
              : 'lg:flex-1 lg:text-label-value-13 lg:text-primary',
          )}
        >
          {tile.label}
        </span>
        <span
          className={cn(
            'flex items-baseline gap-1 whitespace-nowrap font-bold text-label-value-16 leading-tight',
            narrow ? 'lg:text-label-value-13' : 'lg:text-label-value-13',
          )}
        >
          {formatInteger(tile.count)}
          <span className="font-medium text-label-value-12 text-secondary">
            {labelSuffix}
          </span>
        </span>
      </div>
      <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
    </a>
  )
}
