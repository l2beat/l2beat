import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'

interface WhatsNewItem {
  id: string
  title: string
  description: string
  href: string
  imageSrc: string
  imageAlt: string
}

const WHATS_NEW_ITEMS: WhatsNewItem[] = [
  {
    id: 'interop-flows',
    title: 'Interop Flows',
    description:
      'Explore live cross-chain volume, top routes, and bridges across all tracked L2s.',
    href: '/interop/summary',
    imageSrc:
      '/meta-images/publications/interop-interactive-summary-banner.png',
    imageAlt: 'Interactive Interop banner',
  },
]

export function OverviewWhatsNewCard() {
  if (WHATS_NEW_ITEMS.length === 0) {
    return null
  }
  return (
    <PrimaryCard
      className={cn(OVERVIEW_CARD_PADDING_CLASS, 'flex flex-col gap-3')}
    >
      <span className="font-bold text-xl">What's new</span>
      <ul className="flex flex-1 flex-col gap-2">
        {WHATS_NEW_ITEMS.map((item) => (
          <li key={item.id} className="flex flex-1">
            <WhatsNewItemCard item={item} />
          </li>
        ))}
      </ul>
    </PrimaryCard>
  )
}

function WhatsNewItemCard({ item }: { item: WhatsNewItem }) {
  return (
    <a
      href={item.href}
      className={cn(
        'group relative flex flex-1 flex-row overflow-hidden rounded-lg border border-divider',
        'transition-colors duration-200 hover:border-link-stroke',
        'md:flex-col',
      )}
    >
      <div className="relative w-[7.25rem] shrink-0 overflow-hidden bg-surface-secondary sm:w-32 md:aspect-[16/5] md:w-full">
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          loading="lazy"
          className="size-full min-h-[5.5rem] object-cover object-left transition-transform duration-300 group-hover:scale-[1.02] md:min-h-0"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-2.5 md:gap-1 md:p-3">
        <span className="font-bold text-label-value-14 leading-tight md:text-heading-16">
          {item.title}
        </span>
        <p className="line-clamp-2 text-label-value-12 text-secondary leading-snug md:text-label-value-13">
          {item.description}
        </p>
        <span className="mt-0.5 flex items-center gap-1 font-bold text-link text-xs md:mt-auto md:pt-1">
          Explore
          <ArrowRightIcon className="size-3 fill-current transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  )
}
