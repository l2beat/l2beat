import { formatInteger } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ChevronIcon } from '~/icons/Chevron'
import { BridgesIcon } from '~/icons/pages/Bridges'
import { L2Icon } from '~/icons/pages/L2'
import { PrivacyIcon } from '~/icons/pages/Privacy'
import type { SvgIconProps } from '~/icons/SvgIcon'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { cn } from '~/utils/cn'
import type { LandingCounts } from '../getLandingData'
import { LANDING_CONTAINER_CLASS } from '../landingStyles'

interface DomainCard {
  title: string
  href: string
  /** How many the dashboard watches; none where there is nothing to count yet. */
  count?: number
  unit: string
  /** Stands in for the count where there is none. */
  subtitle?: string
  icon: React.ReactNode
}

/** The charts' pink, as the nav's selected items use. */
const ICON_CLASS = 'size-6 stroke-chart-pink'

/**
 * One card per dashboard: a sentence for a title, the section's icon, and
 * how many projects it watches. White, a hairline, nothing else.
 */
export function LandingDomainCards({ counts }: { counts: LandingCounts }) {
  const cards: DomainCard[] = [
    {
      title: 'We keep an eye on the L2s of Ethereum',
      href: '/layer2s/summary',
      count: counts.l2,
      unit: 'projects',
      icon: <L2Icon className={ICON_CLASS} />,
    },
    {
      title: 'We research privacy on Ethereum',
      href: '/privacy',
      count: counts.privacy,
      unit: 'projects',
      icon: <PrivacyIcon className={ICON_CLASS} />,
    },
    {
      title: 'We analyze interop on Ethereum',
      href: '/interop/summary',
      count: counts.interop,
      unit: 'protocols',
      icon: <BridgesIcon className={ICON_CLASS} />,
    },
  ]
  if (env.CLIENT_SIDE_GARDEN_ENABLED) {
    cards.push({
      title: 'We tend the CROPS of Ethereum',
      href: GARDEN_PATH,
      count: counts.crops > 0 ? counts.crops : undefined,
      unit: 'projects',
      subtitle: 'The Infinite Garden',
      icon: <CropsIcon className={ICON_CLASS} />,
    })
  }

  return (
    <section className={LANDING_CONTAINER_CLASS}>
      <ul
        className={cn(
          'grid grid-cols-1 gap-4',
          // Columns the cards fill: no card ends up alone in a row.
          cards.length === 4
            ? 'sm:grid-cols-2 lg:grid-cols-4'
            : 'md:grid-cols-3',
        )}
      >
        {cards.map((card) => (
          <li key={card.href}>
            <a
              href={card.href}
              className="group flex h-full min-h-[190px] flex-col gap-4 rounded-xl border border-divider p-5 transition-colors duration-200 hover:border-link-stroke"
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {card.icon}
              </div>
              <h2 className="text-balance font-semibold text-heading-20 leading-tight tracking-[-0.015em]">
                {card.title}
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
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** A sprout, in the line weight of the other section icons. */
function CropsIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-label="CROPS icon"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <path d="M10 18.5v-7" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M10 11.5c0-3.3 2.5-5.8 5.8-5.8 0 3.3-2.5 5.8-5.8 5.8z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 11.5c0-2.5-2-4.5-4.6-4.5 0 2.5 2 4.5 4.6 4.5z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}
