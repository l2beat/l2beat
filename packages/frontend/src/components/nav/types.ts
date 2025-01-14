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
      match: string
      icon: React.ReactNode
    } & NavLink)

interface NavLink {
  title: string
  shortTitle?: string
  href: string
  disabled?: boolean
}
