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
      className={cn(OVERVIEW_CARD_PADDING_CLASS, 'flex h-full flex-col gap-3')}
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
        'group relative flex flex-1 flex-col overflow-hidden rounded-lg border border-divider',
        'transition-colors duration-200 hover:border-link-stroke',
      )}
    >
      <div className="relative aspect-[16/5] w-full overflow-hidden bg-surface-secondary">
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="font-bold text-heading-16 leading-tight">
          {item.title}
        </span>
        <p className="line-clamp-2 text-label-value-13 text-secondary leading-snug">
          {item.description}
        </p>
        <span className="mt-auto flex items-center gap-1 pt-1 font-bold text-link text-xs">
          Explore
          <ArrowRightIcon className="size-3 fill-current transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  )
}
