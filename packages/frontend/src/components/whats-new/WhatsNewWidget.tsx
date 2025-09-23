import { useIsMobile } from '~/hooks/useIsMobile'
import { useTracking } from '~/hooks/useTracking'

export interface WhatsNewWidget {
  id: string
  href: string
  image: string
  mobileDisabledOnMatches?: string[]
  alt: string
}

export function WhatsNewWidget({ whatsNew }: { whatsNew: WhatsNewWidget }) {
  const { track } = useTracking()
  const isMobile = useIsMobile()

  return (
    <a
      href={whatsNew.href}
      onClick={() => {
        track('whatsNewClicked', {
          props: { device: isMobile ? 'mobile' : 'desktop', action: 'open' },
        })
      }}
    >
      <img src={whatsNew.image} alt={whatsNew.alt} className="w-full" />
    </a>
  )
}
