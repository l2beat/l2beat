import React from 'react'

import { RiskIcon, SummaryIcon } from '../icons'
import { NavigationTabs } from './NavigationTabs'

interface BridgesNavigationTabsProps {
  selected: 'summary' | 'risk'
}

export function BridgesNavigationTabs(props: BridgesNavigationTabsProps) {
  return (
    <NavigationTabs
      pages={[
        {
          fullTitle: 'Summary',
          shortTitle: 'Summary',
          icon: <SummaryIcon />,
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
