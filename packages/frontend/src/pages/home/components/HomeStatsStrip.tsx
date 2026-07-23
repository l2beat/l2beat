import { ChevronIcon } from '~/icons/Chevron'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { DataAvailabilityIcon } from '~/icons/pages/DataAvailability'
import { EcosystemsIcon } from '~/icons/pages/Ecosystems'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { ScalingIcon } from '~/icons/pages/Scaling'
import { ZkCatalogIcon } from '~/icons/pages/ZkCatalog'
import { cn } from '~/utils/cn'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { HomeProjectCounts } from '../getHomeProjectCounts'
import { HomeCard } from './HomeCard'

interface TileMetric {
  count: number
  unit: string
}

interface Tile {
  label: string
  /** Primary metric shown after the label. */
  metric: TileMetric
  /** Optional second metric (e.g. interop protocols), shown after the primary. */
  secondaryMetric?: TileMetric
  href: string
  icon: React.ReactNode
  iconBgClassName: string
}

export function HomeStatsStrip({ counts }: { counts: HomeProjectCounts }) {
  const tiles: Tile[] = [
    {
      label: 'Layer 2s',
      metric: { count: counts.scaling, unit: 'projects' },
      href: '/scaling/summary',
      icon: <ScalingIcon className="size-5 stroke-pink-100" />,
      iconBgClassName: 'bg-pink-100/10',
    },
    {
      label: 'Interop',
      metric: { count: counts.interop, unit: 'chains' },
      secondaryMetric: { count: counts.interopProtocols, unit: 'protocols' },
      href: '/interop/summary',
      icon: <BridgesIcon className="size-5 stroke-orange-500" />,
      iconBgClassName: 'bg-orange-500/10',
    },
    {
      label: 'Privacy',
      metric: { count: counts.privacy, unit: 'projects' },
      href: '/privacy',
      icon: <PrivacyIcon className="size-5 stroke-green-450" />,
      iconBgClassName: 'bg-green-450/10',
    },
    {
      label: 'Data Availability',
      metric: { count: counts.dataAvailability, unit: 'projects' },
      href: '/data-availability/summary',
      icon: <DataAvailabilityIcon className="size-5 fill-blue-500" />,
      iconBgClassName: 'bg-blue-500/10',
    },
    {
      label: 'ZK Catalog',
      metric: { count: counts.zkCatalog, unit: 'projects' },
      href: '/zk-catalog',
      icon: <ZkCatalogIcon className="size-5 stroke-purple-500" />,
      iconBgClassName: 'bg-purple-500/10',
    },
    {
      label: 'Ecosystems',
      metric: { count: counts.ecosystems, unit: 'ecosystems' },
      href: '/ecosystems/agglayer',
      icon: <EcosystemsIcon className="size-5 stroke-teal-500" />,
      iconBgClassName: 'bg-teal-500/10',
    },
  ]

  return (
    <HomeCard>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-1 xl:gap-0 xl:divide-y xl:divide-divider">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <StatTile tile={tile} />
          </li>
        ))}
      </ul>
    </HomeCard>
  )
}

function StatTile({ tile }: { tile: Tile }) {
  return (
    <a
      href={tile.href}
      className={cn(
        'group flex h-full items-center gap-2.5 rounded-lg border border-divider px-2.5 py-2',
        'transition-colors duration-200 hover:border-link-stroke',
        // Narrow column layout on desktop: compact borderless rows.
        'xl:-mx-3 xl:gap-2 xl:rounded-md xl:border-0 xl:px-3 xl:py-2 xl:hover:border-transparent',
      )}
    >
      <div
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-md transition-transform duration-200 group-hover:scale-110 xl:size-7 xl:rounded [&>svg]:xl:size-4',
          tile.iconBgClassName,
        )}
      >
        {tile.icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center xl:flex-row xl:items-baseline xl:gap-2 2xl:gap-3">
        <span className="truncate font-medium text-label-value-12 text-secondary leading-tight transition-colors group-hover:text-link xl:flex-1 xl:text-label-value-14 xl:text-primary xl:group-hover:text-link">
          {tile.label}
        </span>
        <span className="flex flex-wrap items-baseline gap-x-1 font-bold text-label-value-16 leading-tight xl:text-label-value-14">
          <TileMetricValue
            metric={tile.metric}
            // Hide the primary metric below sm when a secondary one exists,
            // so only the secondary (e.g. interop protocols) shows.
            className={tile.secondaryMetric ? 'hidden sm:inline' : undefined}
          />
          {tile.secondaryMetric && (
            <>
              <span className="hidden font-medium text-label-value-12 text-secondary sm:inline">
                ·
              </span>
              <TileMetricValue metric={tile.secondaryMetric} />
            </>
          )}
        </span>
      </div>
      <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-[fill,translate] group-hover:translate-x-0.5 group-hover:fill-link" />
    </a>
  )
}

function TileMetricValue({
  metric,
  className,
}: {
  metric: TileMetric
  className?: string
}) {
  return (
    <span className={cn('whitespace-nowrap', className)}>
      {formatInteger(metric.count)}{' '}
      <span className="font-medium text-label-value-12 text-secondary">
        {metric.unit}
      </span>
    </span>
  )
}
