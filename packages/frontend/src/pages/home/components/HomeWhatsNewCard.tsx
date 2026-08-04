import { useLocalStorage } from '~/hooks/useLocalStorage'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CloseIcon } from '~/icons/Close'
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
    <>
      <script
        dangerouslySetInnerHTML={{ __html: getDismissedCheckScript(items) }}
      />
      <HomeCard
        className={cn(
          'flex flex-col gap-3 overflow-hidden p-0 xl:gap-0 xl:p-0',
          '[[data-whats-new-dismissed]_&]:max-lg:hidden',
          className,
        )}
      >
        <h2 className="sr-only font-bold text-xl md:not-sr-only xl:sr-only">
          What's new
        </h2>
        <ul className="flex flex-1 flex-col gap-2 xl:gap-0">
          {items.map((item) => (
            <li key={item.id} className="relative flex flex-1">
              <WhatsNewItemCard item={item} />
            </li>
          ))}
        </ul>
      </HomeCard>
    </>
  )
}

/**
 * Runs during HTML parsing, before first paint, so returning visitors who
 * already dismissed the card never see it flash on small screens. The attribute
 * lives on <html> (outside the React root) to keep hydration untouched.
 */
function getDismissedCheckScript(items: HomeWhatsNewItem[]): string {
  const keys = JSON.stringify(items.map((item) => `whats-new-${item.id}`))
  return `try{if(${keys}.every(function(k){return localStorage.getItem(k)==='true'}))document.documentElement.dataset.whatsNewDismissed='true'}catch{}`
}

function WhatsNewItemCard({ item }: { item: HomeWhatsNewItem }) {
  const [, setWidgetClosed] = useLocalStorage(`whats-new-${item.id}`, false)
  const dismiss = () => {
    setWidgetClosed(true)
    document.documentElement.dataset.whatsNewDismissed = 'true'
  }
  return (
    <>
      <a
        href={item.href}
        onClick={() => setWidgetClosed(true)}
        className="group relative block flex-1 overflow-hidden md:flex md:flex-row md:rounded-lg md:border-2 md:border-divider xl:block xl:min-h-40 xl:rounded-none xl:border-0"
      >
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
        <div className="absolute inset-x-0 bottom-0 flex min-w-0 flex-col gap-0.5 bg-linear-to-t from-black/85 via-black/60 to-transparent p-2.5 pt-8 md:static md:flex-1 md:justify-center md:gap-1 md:bg-none md:p-3 md:pr-8 lg:pr-3 xl:absolute xl:inset-x-0 xl:bottom-0 xl:bg-linear-to-t xl:p-4 xl:pt-12">
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
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute top-2 right-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60 md:bg-transparent md:hover:bg-surface-tertiary lg:hidden"
      >
        <CloseIcon className="size-[10px] fill-white md:fill-secondary" />
      </button>
    </>
  )
}
