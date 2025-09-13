export interface WhatsNewWidget {
  id: string
  href: string
  image: string
  alt: string
}

export function WhatsNewWidget({ whatsNew }: { whatsNew: WhatsNewWidget }) {
  return (
    <a href={whatsNew.href}>
      <img src={whatsNew.image} alt={whatsNew.alt} className="w-full" />
    </a>
  )
}
