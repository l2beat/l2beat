import React from 'react'

import {
  BridgesPage,
  getBridgesNavigationPages,
} from '../../utils/getNavigationPages'
import { NavigationTabs } from './NavigationTabs'

interface BridgesNavigationTabsProps {
  selected: BridgesPage
}

export function BridgesNavigationTabs(props: BridgesNavigationTabsProps) {
  const pages = getBridgesNavigationPages(props.selected)

  return <NavigationTabs pages={pages} />
}
