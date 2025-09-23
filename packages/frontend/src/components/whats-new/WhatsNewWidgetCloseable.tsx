import { useIsClient } from '~/hooks/useIsClient'
import { useIsMobile } from '~/hooks/useIsMobile'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { usePathname } from '~/hooks/usePathname'
import { useTracking } from '~/hooks/useTracking'
import { CloseIcon } from '~/icons/Close'
import { WhatsNewWidget } from './WhatsNewWidget'

export function WhatsNewWidgetCloseable({
  whatsNew,
}: {
  whatsNew: WhatsNewWidget
}) {
  const isClient = useIsClient()
  const isMobile = useIsMobile()
  const { track } = useTracking()
  const [isClosed, setIsClosed] = useLocalStorage(
    `whats-new-${whatsNew.id}`,
    false,
  )
  const pathname = usePathname()
  if (!isClient) return null

  if (
    isClosed ||
    whatsNew.mobileDisabledOnMatches?.some((match) =>
      pathname.startsWith(match),
    )
  )
    return null

  return (
    <div
      className="fixed right-4 bottom-4 z-[999] max-w-[260px] empty:hidden"
      onClick={() => setIsClosed(true)}
    >
      <button
        className="absolute top-2 right-2 p-1"
        onClick={() => {
          track('whatsNewClicked', {
            props: {
              device: isMobile ? 'mobile' : 'desktop',
              action: 'close',
            },
          })
        }}
      >
        <CloseIcon className="size-4 fill-primary-invert" />
      </button>
      <WhatsNewWidget whatsNew={whatsNew} />
    </div>
  )
}
