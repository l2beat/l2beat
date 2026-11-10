import { useDevice } from '~/hooks/useDevice'
import { useIsClient } from '~/hooks/useIsClient'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { useTracking } from '~/hooks/useTracking'
import { CloseIcon } from '~/icons/Close'
import { cn } from '~/utils/cn'
import { jsonForInlineScript } from '~/utils/jsonForInlineScript'
import { SidebarGroup, SidebarGroupLabel } from '../core/Sidebar'
import { hideSeenWhatsNew } from './hideSeenWhatsNew'
import { useWhatsNewItem } from './WhatsNewItemContext'

/**
 * The latest announcement at the bottom of the nav, on every page.
 *
 * Whether the visitor has seen it lives in localStorage and pages are cached
 * at the edge, so the server can't know. It renders the card for everyone,
 * and an inline script hides a seen one before the first paint. Rendering it
 * only in the browser made it vanish and come back on every page load.
 */
export function NavWhatsNew({
  onNavigate,
  className,
}: {
  onNavigate: () => void
  className?: string
}) {
  const item = useWhatsNewItem()
  const isClient = useIsClient()
  const { track } = useTracking()
  const { isDesktop } = useDevice()
  // Opening the item or dismissing it hides it until the next one.
  const seenKey = item ? (`whats-new-${item.id}` as const) : 'whats-new-none'
  const [seen, setSeen] = useLocalStorage(seenKey, false)
  // Before hydration the markup is the server's, with the card in it.
  if (!item || (isClient && seen)) {
    return null
  }
  const script = `(${hideSeenWhatsNew.toString()})(document.currentScript.parentElement, ${jsonForInlineScript(seenKey)})`
  const device = isDesktop ? 'desktop' : 'mobile'
  return (
    // At the end of the nav, just above its footer; at least 20px under the
    // lists above when the nav is full.
    <SidebarGroup
      className={cn('mt-auto pt-5', className)}
      // The script may have hidden it; React would log the difference in dev.
      suppressHydrationWarning
    >
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>What&apos;s new</SidebarGroupLabel>
        <button
          type="button"
          onClick={() => {
            track('whatsNewClicked', { device, action: 'close' })
            setSeen(true)
          }}
          aria-label="Dismiss What's new"
          className="-my-1 grid size-6 place-items-center rounded-md text-secondary transition-colors hover:bg-surface-tertiary hover:text-primary"
        >
          <CloseIcon className="size-3 fill-current" />
        </button>
      </div>
      <a
        href={item.href}
        onClick={() => {
          track('whatsNewClicked', { device, action: 'open' })
          setSeen(true)
          onNavigate()
        }}
        className="group/whats-new @container mt-1 flex flex-col gap-2 px-1.5"
      >
        {/* 16:9, its height rounded down to a whole pixel so the text under
            it stays on the pixel grid (plain 16:9 without CSS round()). */}
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          loading="lazy"
          className="aspect-video h-[round(down,56.25cqw,1px)] w-full rounded-md object-cover object-top-left"
        />
        <span className="flex flex-col gap-0.5">
          <span className="font-medium text-sm underline-offset-2 group-hover/whats-new:underline">
            {item.title}
          </span>
          {item.description && (
            <span className="line-clamp-3 text-secondary text-xs leading-normal">
              {item.description}
            </span>
          )}
        </span>
      </a>
      <script
        dangerouslySetInnerHTML={{ __html: script }}
        // The server and the browser bundle print the function differently.
        suppressHydrationWarning
      />
    </SidebarGroup>
  )
}
