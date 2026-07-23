import { useLocalStorage } from '~/hooks/useLocalStorage'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
import { HomeCard } from './HomeCard'

export interface HomeWhatsNewItem {
  id: string
  title: string
  description: string | undefined
  href: string
  imageSrc: string
  verticalImageSrc: string | undefined
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
    <HomeCard
      className={cn(
        'flex flex-col gap-3 overflow-hidden p-0 xl:gap-0 xl:p-0',
        className,
      )}
    >
      <h2 className="sr-only font-bold text-xl md:not-sr-only xl:sr-only">
        What's new
      </h2>
      <ul className="flex flex-1 flex-col gap-2 xl:gap-0">
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
  const [, setWidgetClosed] = useLocalStorage(`whats-new-${item.id}`, false)
  return (
    <a
      href={item.href}
      onClick={() => setWidgetClosed(true)}
      className="group relative block flex-1 overflow-hidden md:flex md:flex-row md:rounded-lg md:border-2 md:border-divider xl:block xl:min-h-40 xl:rounded-none xl:border-0"
    >
      {/* Below md and from xl up the item is a poster: the image is the card
          background and the text sits on a dark scrim at the bottom. The
          default 16:9 asset serves the mobile poster; at xl the vertical
          asset fills whatever box the column slack produces. In between
          (md–xl) the item is a compact thumbnail row. */}
      <div className="relative aspect-video w-full overflow-hidden md:aspect-auto md:w-32 md:shrink-0 xl:absolute xl:inset-0 xl:w-full">
        <picture className="contents">
          <source
            media="(min-width: 1440px)"
            srcSet={item.verticalImageSrc ?? item.imageSrc}
          />
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            loading="lazy"
            className="size-full object-cover object-top-left transition-transform duration-300 group-hover:scale-[1.02] md:min-h-[5.5rem] xl:min-h-0"
          />
        </picture>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex min-w-0 flex-col gap-0.5 bg-linear-to-t from-black/85 via-black/60 to-transparent p-2.5 pt-8 md:static md:flex-1 md:justify-center md:gap-1 md:bg-none md:p-3 xl:absolute xl:inset-x-0 xl:bottom-0 xl:bg-linear-to-t xl:p-4 xl:pt-12">
        <span
          aria-hidden
          className="font-bold text-white/70 text-xs uppercase tracking-wide md:hidden xl:block"
        >
          What's new
        </span>
        <span className="font-bold text-label-value-14 text-pure-white leading-tight md:text-heading-16 md:text-primary xl:text-pure-white">
          {item.title}
        </span>
        {item.description && (
          <p className="line-clamp-2 text-label-value-12 text-white/80 leading-snug md:text-label-value-13 md:text-secondary xl:text-white/80">
            {item.description}
          </p>
        )}
        <span className="mt-0.5 flex items-center gap-1 font-bold text-[#66b2ff] text-xs md:text-link xl:text-[#66b2ff]">
          Explore
          <ArrowRightIcon className="size-3 fill-current transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  )
}
