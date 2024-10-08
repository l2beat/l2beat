export type NavGroup =
  | {
      type: 'multiple'
      title: string
      match: string
      icon: React.ReactNode
      links: NavLink[]
      secondaryLinks?: NavLink[]
    }
  | ({
      type: 'single'
      icon: React.ReactNode
    } & NavLink)

interface NavLink {
  title: string
  href: string
  disabled?: boolean
}
