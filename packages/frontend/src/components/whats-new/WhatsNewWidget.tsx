import { useDevice } from '~/hooks/useDevice'
import { useTracking } from '~/hooks/useTracking'

export interface WhatsNewWidget {
  id: string
  href: string
  image: string
  disabledOnMatches?: string[]
  alt: string
}

export function WhatsNewWidget({ whatsNew }: { whatsNew: WhatsNewWidget }) {
  const { track } = useTracking()
  const { isDesktop } = useDevice()

  return (
    <a
      href={whatsNew.href}
      onClick={() => {
        track('whatsNewClicked', {
          device: isDesktop ? 'desktop' : 'mobile',
          action: 'open',
        })
      }}
    >
      <img
        src={whatsNew.image}
        alt={whatsNew.alt}
        loading="lazy"
        className="w-full"
      />
    </a>
  )
}
