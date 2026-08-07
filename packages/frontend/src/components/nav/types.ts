export type NavGroup =
  | {
      type: 'multiple'
      title: string
      match: string
      icon: React.ReactNode
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
  subLinks?: NavLink[]
  exactMatch?: boolean
}

/**
 * Optional per-section metric shown in the side nav, keyed by `NavGroup.match`.
 */
export interface NavSectionCount {
  /** Right-aligned value, e.g. "110" or "28 · 41". Kept short on purpose. */
  value: React.ReactNode
  /** Spelled out for tooltips and screen readers, e.g. "110 projects". */
  label: string
}

export type NavSectionCounts = Record<string, NavSectionCount | undefined>
