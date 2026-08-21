export type NavGroup =
  | {
      type: 'multiple'
      title: string
      match: string
      icon: React.ReactNode
      disableMobileTabs?: boolean
      links: NavLink[]
      /** Link sections rendered after `links`, each preceded by a separator. */
      secondaryLinks?: NavLink[][]
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
  subLinks?: NavLink[]
  exactMatch?: boolean
}
