import { formatInteger } from '@l2beat/shared-pure'
import {
  type GardenFlower,
  GardenFlowers,
  GardenLandscape,
} from '~/components/garden/GardenSky'
import { ChevronIcon } from '~/icons/Chevron'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { L2Icon } from '~/icons/pages/L2'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { cn } from '~/utils/cn'
import type { LandingCounts } from '../getLandingData'
import { LANDING_CONTAINER_CLASS } from '../landingStyles'

interface DomainCard {
  /** A sentence around the section's name, which it sets apart. */
  title: { before: string; category: string; after: string }
  href: string
  /** How many the dashboard watches; none where there is nothing to count yet. */
  count?: number
  unit: string
  /** Stands in for the count where there is none. */
  subtitle?: string
  /** None on the garden card: the sun stands in for it. */
  icon?: React.ReactNode
  /** Drawn as a corner of the garden, like the CROPS banner on Home. */
  garden?: boolean
}

/** Two flowers on the nearest ridge, bottom right, clear of the count. */
const GARDEN_FLOWERS: GardenFlower[] = [
  { left: '60%', bottom: '3%', width: 22 },
  { left: '74%', bottom: '6%', width: 26 },
]

/** The charts' pink, as the nav's selected items use. */
const ICON_CLASS = 'size-6 stroke-chart-pink'

/**
 * One card per dashboard: a sentence for a title, the section's icon, and
 * how many projects it watches. White, a hairline, nothing else. The sentence
 * is quiet and the section's name in it is not, so the names are what a quick
 * look across the cards picks up.
 */
export function LandingDomainCards({ counts }: { counts: LandingCounts }) {
  const cards: DomainCard[] = [
    {
      title: {
        before: 'We keep an eye on the',
        category: 'Layer 2s',
        after: 'of Ethereum',
      },
      href: '/layer2s/summary',
      count: counts.l2,
      unit: 'projects',
      icon: <L2Icon className={ICON_CLASS} />,
    },
    {
      title: {
        before: 'We research',
        category: 'Privacy',
        after: 'on Ethereum',
      },
      href: '/privacy',
      count: counts.privacy,
      unit: 'projects',
      icon: <PrivacyIcon className={ICON_CLASS} />,
    },
    {
      title: {
        before: 'We analyze',
        category: 'Interop',
        after: 'on Ethereum',
      },
      href: '/interop/summary',
      count: counts.interop,
      unit: 'protocols',
      icon: <BridgesIcon className={ICON_CLASS} />,
    },
    {
      title: { before: 'We tend the', category: 'CROPS', after: '' },
      href: GARDEN_PATH,
      count: counts.crops > 0 ? counts.crops : undefined,
      unit: 'projects',
      subtitle: 'The Infinite Garden',
      garden: true,
    },
  ]

  return (
    <section className={LANDING_CONTAINER_CLASS}>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.href}>
            <a
              href={card.href}
              className={cn(
                'group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-xl border p-5 transition-colors duration-200',
                card.garden
                  ? 'border-garden-border hover:border-garden-accent/50 dark:border-[#1d2a36]'
                  : 'border-divider hover:border-link-stroke',
              )}
            >
              {card.garden && (
                <GardenLandscape
                  lightClassName="top-[22%] left-[82%] size-28"
                  ridgesClassName="h-[45%]"
                >
                  <GardenFlowers flowers={GARDEN_FLOWERS} />
                </GardenLandscape>
              )}
              <div className="relative flex grow flex-col gap-4">
                {/* Without an icon the row stays, empty, so the titles
                    line up across the cards. */}
                <div className="size-6 transition-transform duration-200 group-hover:scale-110">
                  {card.icon}
                </div>
                <h2 className="text-balance font-normal text-heading-20 text-secondary leading-snug tracking-[-0.015em]">
                  {card.title.before}{' '}
                  <span className="font-semibold text-heading-24 text-primary underline decoration-2 decoration-chart-pink underline-offset-[6px]">
                    {card.title.category}
                  </span>
                  {card.title.after && ` ${card.title.after}`}
                </h2>
                <div className="mt-auto flex items-baseline justify-between gap-2">
                  {card.count !== undefined ? (
                    <span className="whitespace-nowrap">
                      <span className="font-semibold text-heading-24 tabular-nums leading-tight tracking-[-0.02em]">
                        {formatInteger(card.count)}
                      </span>{' '}
                      <span className="font-normal text-label-value-12 text-secondary">
                        {card.unit}
                      </span>
                    </span>
                  ) : (
                    <span className="font-light font-roboto-serif text-[17px] text-secondary leading-tight tracking-[-0.01em]">
                      {card.subtitle}
                    </span>
                  )}
                  <ChevronIcon className="-rotate-90 size-3 shrink-0 self-center fill-secondary transition-[fill,translate] group-hover:translate-x-0.5 group-hover:fill-link" />
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
