import { formatInteger } from '@l2beat/shared-pure'
import type { NavGroup } from '~/components/nav/types'
import { navGroups } from '~/consts/navGroups'
import { env } from '~/env'
import { ChevronIcon } from '~/icons/Chevron'
import { L2Icon } from '~/icons/pages/L2'
import { LiquidStakingIcon } from '~/icons/pages/LiquidStaking'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { cn } from '~/utils/cn'
import type { HomeProjectCounts } from '../getHomeProjectCounts'
import { CropsMiniBanner } from './CropsMiniBanner'
import { HomeCard } from './HomeCard'
import { SoonBadge } from './SoonBadge'

interface TileMetric {
  count: number
  unit: string
}

interface Tile {
  label: string
  /** None for a section that is not out yet. */
  metric?: TileMetric
  href?: string
  icon: React.ReactNode
}

interface MoreItem {
  label: string
  href: string
}

/** The charts' pink, so the menu's sections match the cards below. */
const ICON_CLASS = 'size-5 stroke-chart-pink'

/** The domains the strip shows as tiles, by their nav group's `match`. */
const TILES: Record<
  string,
  { icon: React.ReactNode; count?: (counts: HomeProjectCounts) => number }
> = {
  privacy: {
    icon: <PrivacyIcon className={ICON_CLASS} />,
    count: (counts) => counts.privacy,
  },
  layer2s: {
    icon: <L2Icon className={ICON_CLASS} />,
    count: (counts) => counts.l2,
  },
  'liquid-staking': {
    icon: <LiquidStakingIcon className="size-5 stroke-secondary" />,
  },
}

/** A group's own page, or its first link's; none while it is not out yet. */
function getGroupHref(group: NavGroup): string | undefined {
  if (group.type === 'single') {
    return group.disabled ? undefined : group.href
  }
  return group.links[0]?.[0]?.href
}

/**
 * The desktop sidebar's menu, for the screens where it hides behind the menu
 * button, in its order: the garden and the domains as tiles, then the rest a
 * size down, as small boxes.
 */
export function HomeStatsStrip({
  counts,
  className,
}: {
  counts: HomeProjectCounts
  className?: string
}) {
  const domains = navGroups.flatMap((group): Tile[] => {
    const tile = TILES[group.match]
    if (!tile || group.section === 'more') return []
    const href = getGroupHref(group)
    return [
      {
        label: group.title,
        metric: tile.count && { count: tile.count(counts), unit: 'projects' },
        href,
        icon: tile.icon,
      },
    ]
  })

  const more = navGroups.flatMap((group): MoreItem[] => {
    const href = getGroupHref(group)
    return group.section === 'more' && href
      ? [{ label: group.title, href }]
      : []
  })

  return (
    <HomeCard className={cn('flex flex-col gap-2', className)}>
      <ul
        className={cn(
          'grid grid-cols-2 gap-2',
          env.CLIENT_SIDE_GARDEN_ENABLED ? 'md:grid-cols-4' : 'md:grid-cols-3',
        )}
      >
        {env.CLIENT_SIDE_GARDEN_ENABLED && (
          <li>
            <CropsMiniBanner className="h-full rounded-lg" />
          </li>
        )}
        {domains.map((tile) => (
          <li key={tile.label}>
            <StatTile tile={tile} />
          </li>
        ))}
      </ul>
      {/* The full width between them, evenly where the names allow; two to a
          row on phones, where four names do not fit across. */}
      <ul className="grid grid-cols-2 gap-2 sm:flex [&>li:last-child:nth-child(odd)]:max-sm:col-span-2">
        {more.map((item) => (
          <li key={item.label} className="flex-1">
            <MoreLink item={item} />
          </li>
        ))}
      </ul>
    </HomeCard>
  )
}

function StatTile({ tile }: { tile: Tile }) {
  const content = (
    <>
      <div className="flex shrink-0 transition-transform duration-200 group-hover:scale-110">
        {tile.icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span
          className={cn(
            'truncate font-medium text-label-value-13 text-secondary leading-4 transition-colors',
            tile.href && 'group-hover:text-link',
          )}
        >
          {tile.label}
        </span>
        {tile.metric ? (
          <span className="font-semibold text-label-value-16 leading-5">
            <TileMetricValue metric={tile.metric} />
          </span>
        ) : (
          <SoonBadge className="mt-0.5 w-fit" />
        )}
      </div>
      {tile.href && (
        <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-[fill,translate] group-hover:translate-x-0.5 group-hover:fill-link" />
      )}
    </>
  )
  const className =
    'group flex h-full items-center gap-2.5 rounded-lg border border-divider px-2.5 py-2'
  if (!tile.href) {
    return <div className={className}>{content}</div>
  }
  return (
    <a
      href={tile.href}
      className={cn(
        className,
        'transition-colors duration-200 hover:border-link-stroke',
      )}
    >
      {content}
    </a>
  )
}

/** A secondary section: a box with just its name, a row tall for touch. */
function MoreLink({ item }: { item: MoreItem }) {
  return (
    <a
      href={item.href}
      className="group flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-divider px-2.5 font-medium text-label-value-15 leading-4 transition-colors duration-200 hover:border-link-stroke"
    >
      {item.label}
      <ChevronIcon className="-rotate-90 size-2 shrink-0 fill-secondary transition-[fill,translate] group-hover:translate-x-0.5 group-hover:fill-link" />
    </a>
  )
}

function TileMetricValue({ metric }: { metric: TileMetric }) {
  return (
    <span className="whitespace-nowrap">
      {formatInteger(metric.count)}{' '}
      <span className="font-medium text-label-value-13 text-secondary">
        {metric.unit}
      </span>
    </span>
  )
}
