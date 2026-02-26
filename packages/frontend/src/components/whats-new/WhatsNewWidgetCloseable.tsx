import { useDevice } from '~/hooks/useDevice'
import { useIsClient } from '~/hooks/useIsClient'
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
  const { isDesktop } = useDevice()
  const { track } = useTracking()
  const [isClosed, setIsClosed] = useLocalStorage(
    `whats-new-${whatsNew.id}`,
    false,
  )
  const pathname = usePathname()
  if (!isClient) return null

  if (
    isClosed ||
    whatsNew.disabledOnMatches?.some((match) => pathname.startsWith(match))
  )
    return null

  return (
    <div
      className="fixed right-4 bottom-4 z-[999] max-w-[260px] empty:hidden md:right-8 md:max-w-[320px]"
      onClick={() => setIsClosed(true)}
    >
      <button
        className="absolute top-1 right-1 bg-primary-invert p-1 shadow-lg"
        onClick={() => {
          track('whatsNewClicked', {
            props: {
              device: isDesktop ? 'desktop' : 'mobile',
              action: 'close',
            },
          })
        }}
      >
        <CloseIcon className="size-4 fill-primary" />
      </button>
      <WhatsNewWidget whatsNew={whatsNew} />
    </div>
  )
}
