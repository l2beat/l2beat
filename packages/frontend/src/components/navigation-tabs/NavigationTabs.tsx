import React from 'react'

import { NavigationPage } from '../../utils/getNavigationPages'
import { DesktopTabs } from './DesktopTabs'
import { MobileTabs } from './MobileTabs'

export interface PageSelectionProps {
  pages: NavigationPage[]
}

export function NavigationTabs({ pages }: PageSelectionProps) {
  return (
    <nav className="md:mt-10">
      <DesktopTabs pages={pages} />
      <MobileTabs pages={pages} />
    </nav>
  )
}
