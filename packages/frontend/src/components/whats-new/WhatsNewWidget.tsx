/** The changelog entry whose campaign is running, announced in the page below lg. */
export interface WhatsNewWidget {
  id: string
  title: string
  href: string
  image: string
  disabledOnMatches?: string[]
  alt: string
}
