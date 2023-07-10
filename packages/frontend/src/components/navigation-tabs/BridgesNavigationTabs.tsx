import React from 'react'

import { RiskIcon, TvlIcon } from '../icons'
import { NavigationTabs } from './NavigationTabs'

interface BridgesNavigationTabsProps {
  selected: 'summary' | 'risk'
}

export function BridgesNavigationTabs(props: BridgesNavigationTabsProps) {
  return (
    <NavigationTabs
      pages={[
        {
          fullTitle: 'Total Value Locked',
          shortTitle: 'TVL',
          icon: <TvlIcon />,
          link: '/bridges/summary',
          selected: props.selected === 'summary',
        },
        {
          icon: <RiskIcon />,
          fullTitle: 'Risk Analysis',
          shortTitle: 'Risks',
          link: '/bridges/risk',
          selected: props.selected === 'risk',
        },
      ]}
    />
  )
}
