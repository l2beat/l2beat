import React, { ReactNode } from 'react'

import { DesktopTabs } from './DesktopTabs'
import { MobileTabs } from './MobileTabs'

export interface PageSelectionProps {
  pages: {
    fullTitle: ReactNode
    shortTitle: ReactNode
    icon?: ReactNode
    link: string
    selected: boolean
  }[]
}

export function NavigationTabs({ pages }: PageSelectionProps) {
  return (
    <nav className="mb-4 md:mb-12 md:mt-10 font-base">
      <DesktopTabs pages={pages} />
      <MobileTabs pages={pages} />
    </nav>
  )
}
