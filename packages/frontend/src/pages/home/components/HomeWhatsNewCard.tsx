import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
import { HomeCard } from './HomeCard'

export interface HomeWhatsNewItem {
  id: string
  title: string
  description: string | undefined
  href: string
  imageSrc: string
  imageAlt: string
}

export function HomeWhatsNewCard({
  items,
  className,
}: {
  items: HomeWhatsNewItem[]
  className?: string
}) {
  if (items.length === 0) {
    return null
  }
  return (
    <HomeCard className={cn('flex flex-col gap-3', className)}>
      <h2 className="font-bold text-xl">What's new</h2>
      <ul className="flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-1">
            <WhatsNewItemCard item={item} />
          </li>
        ))}
      </ul>
    </HomeCard>
  )
}

function WhatsNewItemCard({ item }: { item: HomeWhatsNewItem }) {
  return (
    <a
      href={item.href}
      className="group relative flex flex-1 flex-row overflow-hidden rounded-lg border-2 border-divider xl:flex-col"
    >
      {/* At xl the image absorbs all the column slack (the text block is
          flex-none), so it gains vertical visibility as the screen grows. */}
      <div className="relative w-[7.25rem] shrink-0 overflow-hidden sm:w-32 xl:min-h-24 xl:w-full xl:flex-1">
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          loading="lazy"
          className="size-full min-h-[5.5rem] object-cover object-top-left transition-transform duration-300 group-hover:scale-[1.02] xl:absolute xl:inset-0 xl:min-h-0"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-2.5 md:gap-1 md:p-3 xl:flex-none">
        <span className="font-bold text-label-value-14 leading-tight md:text-heading-16">
          {item.title}
        </span>
        {item.description && (
          <p className="line-clamp-2 text-label-value-12 text-secondary leading-snug md:text-label-value-13">
            {item.description}
          </p>
        )}
        <span className="mt-0.5 flex items-center gap-1 font-bold text-link text-xs xl:mt-auto xl:pt-1">
          Explore
          <ArrowRightIcon className="size-3 fill-current transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  )
}
