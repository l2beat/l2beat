export interface NavGroup {
  title: string
  links: NavLink[]
  secondaryLinks?: NavLink[]
}

interface NavLink {
  title: string
  icon: React.ReactNode
  href: string
  disabled?: boolean
}
