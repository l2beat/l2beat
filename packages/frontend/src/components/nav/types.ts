export type NavGroup =
  | {
      type: 'multiple'
      title: string
      match: string
      icon: React.ReactNode
      preventTitleNavigation?: boolean
      disableMobileTabs?: boolean
      links: NavLink[]
      secondaryLinks?: NavLink[]
    }
  | ({
      type: 'single'
      match: string
      icon: React.ReactNode
    } & NavLink)

export interface NavLink {
  title: string
  shortTitle?: string
  href: string
  disabled?: boolean
  accessory?: React.ReactNode
}
