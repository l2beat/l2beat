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
  metric: TileMetric
  secondaryMetric?: TileMetric
  href: string
  icon: React.ReactNode
}

/**
 * Sections and their project counts. Shown below `xl` only: from there up the
 * same counts sit in the side nav, which is always visible, while on smaller
 * screens the nav hides behind the menu button.
 */
export function HomeStatsStrip({
  counts,
  className,
}: {
  counts: HomeProjectCounts
  className?: string
}) {
  const tiles: Tile[] = [
    {
      label: 'Layer 2s',
      metric: { count: counts.scaling, unit: 'projects' },
      href: '/scaling/summary',
      icon: <ScalingIcon className="size-5" />,
    },
    {
      label: 'Interop',
      metric: { count: counts.interop, unit: 'chains' },
      secondaryMetric: { count: counts.interopProtocols, unit: 'protocols' },
      href: '/interop/summary',
      icon: <BridgesIcon className="size-5" />,
    },
    {
      label: 'Privacy',
      metric: { count: counts.privacy, unit: 'projects' },
      href: '/privacy',
      icon: <PrivacyIcon className="size-5" />,
    },
    {
      label: 'Data Availability',
      metric: { count: counts.dataAvailability, unit: 'projects' },
      href: '/data-availability/summary',
      icon: <DataAvailabilityIcon className="size-5" />,
    },
    {
      label: 'ZK Catalog',
      metric: { count: counts.zkCatalog, unit: 'projects' },
      href: '/zk-catalog',
      icon: <ZkCatalogIcon className="size-5" />,
    },
    {
      label: 'Ecosystems',
      metric: { count: counts.ecosystems, unit: 'ecosystems' },
      href: '/ecosystems/agglayer',
      icon: <EcosystemsIcon className="size-5" />,
    },
  ]

  return (
    <HomeCard className={className}>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
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
      )}
    >
      <div className="flex size-6 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110">
        {tile.icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="truncate font-medium text-label-value-12 text-secondary leading-tight transition-colors group-hover:text-link">
          {tile.label}
        </span>
        <span className="flex flex-wrap items-baseline gap-x-1 font-bold text-label-value-16 leading-tight">
          <TileMetricValue
            metric={tile.metric}
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
