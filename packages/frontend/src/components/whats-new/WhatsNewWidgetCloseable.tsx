import { useIsClient } from '~/hooks/useIsClient'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { CloseIcon } from '~/icons/Close'
import { WhatsNewWidget } from './WhatsNewWidget'

export function WhatsNewWidgetCloseable({
  whatsNew,
}: {
  whatsNew: WhatsNewWidget
}) {
  const isClient = useIsClient()
  const [isClosed, setIsClosed] = useLocalStorage(
    `whats-new-${whatsNew.id}`,
    false,
  )
  if (isClosed || !isClient) return null

  return (
    <div
      className="fixed right-4 bottom-4 z-[999] max-w-[260px] empty:hidden"
      onClick={() => setIsClosed(true)}
    >
      <button className="absolute top-2 right-2 p-1">
        <CloseIcon className="size-4 fill-primary-invert" />
      </button>
      <WhatsNewWidget whatsNew={whatsNew} />
    </div>
  )
}
