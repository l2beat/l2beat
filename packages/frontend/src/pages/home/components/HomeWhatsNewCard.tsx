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
  item,
  className,
}: {
  item: HomeWhatsNewItem | undefined
  className?: string
}) {
  if (!item) {
    return null
  }
  console.log(item)
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: getDismissedCheckScript(item) }}
      />
      <HomeCard
        className={cn(
          'flex flex-col gap-3 overflow-hidden p-0 xl:gap-0 xl:p-0',
          '[[data-whats-new-dismissed]_&]:max-xl:hidden',
          className,
        )}
      >
        <h2 className="sr-only font-bold text-xl md:not-sr-only xl:sr-only">
          What's new
        </h2>
        <div className="relative flex flex-1">
          <WhatsNewItemCard item={item} />
        </div>
      </HomeCard>
    </>
  )
}

/**
 * Runs during HTML parsing, before first paint, so returning visitors who
 * already dismissed the card never see it flash on small screens. The attribute
 * lives on <html> (outside the React root) to keep hydration untouched.
 */
function getDismissedCheckScript(item: HomeWhatsNewItem): string {
  const key = JSON.stringify(`whats-new-${item.id}`)
  return `try{if(localStorage.getItem(${key})==='true')document.documentElement.dataset.whatsNewDismissed='true'}catch{}`
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
        <div className="relative aspect-video w-full overflow-hidden [container-type:size] md:aspect-auto md:min-h-[5.5rem] md:w-32 md:shrink-0 xl:absolute xl:inset-0 xl:min-h-0 xl:w-full">
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            loading="lazy"
            className={cn(
              'size-full object-cover object-top-left transition-transform duration-300 group-hover:scale-[1.02]',
              item.verticalImageSrc && '[@container_(aspect-ratio<1)]:hidden',
            )}
          />
          {item.verticalImageSrc && (
            <img
              src={item.verticalImageSrc}
              alt={item.imageAlt}
              loading="lazy"
              className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] [@container_(aspect-ratio>=1)]:hidden"
            />
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex min-w-0 flex-col gap-0.5 bg-linear-to-t from-black/85 via-black/60 to-transparent p-2.5 pt-8 md:static md:flex-1 md:justify-center md:gap-1 md:bg-none md:p-3 md:pr-8 xl:absolute xl:inset-x-0 xl:bottom-0 xl:bg-linear-to-t xl:p-4 xl:pt-12 xl:pr-4">
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
        className="absolute top-2 right-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60 md:bg-transparent md:hover:bg-surface-tertiary xl:hidden"
      >
        <CloseIcon className="size-[10px] fill-white md:fill-secondary" />
      </button>
    </>
  )
}
