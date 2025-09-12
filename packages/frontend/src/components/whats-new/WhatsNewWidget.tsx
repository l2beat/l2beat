import { useWhatsNewContext } from './WhatsNewContext'

export interface WhatsNewWidget {
  href: string
  image: string
  alt: string
}

export function WhatsNewWidget() {
  const whatsNew = useWhatsNewContext()
  if (!whatsNew) return null

  return (
    <a href={whatsNew.href}>
      <img src={whatsNew.image} alt={whatsNew.alt} className="w-full" />
    </a>
  )
}
