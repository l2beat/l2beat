import { useDevice } from '~/hooks/useDevice'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { usePathname } from '~/hooks/usePathname'
import { useTracking } from '~/hooks/useTracking'
import { CloseIcon } from '~/icons/Close'
import { cn } from '~/utils/cn'
import type { WhatsNewWidget } from './WhatsNewWidget'

/**
 * The running campaign at the top of the page, below lg, where the nav that
 * shows it from lg is a closed menu. In the flow, not floating, so it never
 * covers the content.
 */
export function WhatsNewBanner({
  whatsNew,
  className,
}: {
  whatsNew: WhatsNewWidget
  className?: string
}) {
  const { isDesktop } = useDevice()
  const { track } = useTracking()
  // The nav's key too, so dismissing either retires both.
  const storageKey = `whats-new-${whatsNew.id}` as const
  // Read after hydration, so the first render matches the server's.
  const [isClosed, setIsClosed] = useLocalStorage(storageKey, false, {
    initializeWithValue: false,
  })
  const pathname = usePathname()
  if (
    isClosed ||
    pathname === '/' ||
    whatsNew.disabledOnMatches?.some((match) => pathname.startsWith(match))
  ) {
    return null
  }
  const device = isDesktop ? 'desktop' : 'mobile'

  return (
    <>
      {/* Rendered on the server and hidden before the first paint when it was
          dismissed: showing up after hydration would push the page down, and
          a #section link would land past its section. */}
      <script
        dangerouslySetInnerHTML={{ __html: hideIfDismissedScript(storageKey) }}
      />
      <div
        className={cn(
          'flex in-data-whats-new-dismissed:hidden items-center gap-3 border-divider border-b bg-surface-primary py-2 pr-2 pl-4 md:mb-5 md:rounded-lg md:border md:pl-2',
          className,
        )}
      >
        <a
          href={whatsNew.href}
          onClick={() => {
            track('whatsNewClicked', { device, action: 'open' })
            setIsClosed(true)
          }}
          className="group/whats-new flex min-w-0 flex-1 items-center gap-3"
        >
          <img
            src={whatsNew.image}
            alt={whatsNew.alt}
            className="aspect-video w-20 shrink-0 rounded-md object-cover object-top-left"
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-medium text-label-value-12 text-secondary">
              What&apos;s new
            </span>
            <span className="truncate font-medium text-sm underline-offset-2 group-hover/whats-new:underline">
              {whatsNew.title}
            </span>
          </span>
        </a>
        <button
          type="button"
          aria-label="Dismiss What's new"
          onClick={() => {
            track('whatsNewClicked', { device, action: 'close' })
            setIsClosed(true)
          }}
          className="grid size-8 shrink-0 place-items-center rounded-md text-secondary transition-colors hover:bg-surface-tertiary hover:text-primary"
        >
          <CloseIcon className="size-3 fill-current" />
        </button>
      </div>
    </>
  )
}

function hideIfDismissedScript(storageKey: string) {
  return `try{if(localStorage.getItem(${JSON.stringify(storageKey)})==="true")document.documentElement.setAttribute("data-whats-new-dismissed","")}catch(e){}`
}
