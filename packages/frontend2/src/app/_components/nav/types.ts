export interface NavGroup {
  title: string
  links: {
    title: string
    icon: React.ReactNode
    href: string
    enabled: boolean
  }[]
}
