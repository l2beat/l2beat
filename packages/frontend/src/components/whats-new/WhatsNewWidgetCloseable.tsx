import { useDevice } from '~/hooks/useDevice'
import { useIsClient } from '~/hooks/useIsClient'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { usePathname } from '~/hooks/usePathname'
import { useTracking } from '~/hooks/useTracking'
import { CloseIcon } from '~/icons/Close'
import { cn } from '~/utils/cn'
import { useDismissal } from './useDismissal'
import { WhatsNewWidget } from './WhatsNewWidget'

export function WhatsNewWidgetCloseable({
  whatsNew,
}: {
  whatsNew: WhatsNewWidget
}) {
  const isClient = useIsClient()
  const { isDesktop } = useDevice()
  const { track } = useTracking()
  const [isClosed, setIsClosed] = useLocalStorage(
    `whats-new-${whatsNew.id}`,
    false,
  )
  const pathname = usePathname()
  // Dismissed, it slips away into its corner before it goes.
  const { leaving, dismiss, onAnimationEnd } = useDismissal(() =>
    setIsClosed(true),
  )
  if (!isClient) return null

  if (
    isClosed ||
    pathname === '/' ||
    whatsNew.disabledOnMatches?.some((match) => pathname.startsWith(match))
  )
    return null

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-[999] max-w-[260px] empty:hidden md:right-8 md:max-w-[320px]',
        leaving &&
          'fade-out-0 slide-out-to-bottom-3 slide-out-to-right-3 zoom-out-95 pointer-events-none animate-out fill-mode-forwards duration-150 ease-out',
      )}
      onClick={dismiss}
      onAnimationEnd={onAnimationEnd}
    >
      <button
        aria-label="Dismiss What's new"
        className="absolute top-1 right-1 bg-primary-invert p-1 shadow-lg"
        onClick={() => {
          track('whatsNewClicked', {
            device: isDesktop ? 'desktop' : 'mobile',
            action: 'close',
          })
        }}
      >
        <CloseIcon className="size-4 fill-primary" />
      </button>
      <WhatsNewWidget whatsNew={whatsNew} />
    </div>
  )
}
