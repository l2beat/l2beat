import React from 'react'

import { ActivityIcon, RiskIcon, TvlIcon } from '../icons'
import { NavigationTabs } from './NavigationTabs'

interface ScalingNavigationTabsProps {
  selected: 'tvl' | 'risk' | 'activity'
  showActivity: boolean
}

export function ScalingNavigationTabs(props: ScalingNavigationTabsProps) {
  const pages = [
    {
      fullTitle: 'Total Value Locked',
      shortTitle: 'TVL',
      icon: <TvlIcon />,
      link: '/scaling/tvl',
      selected: props.selected === 'tvl',
    },
    {
      fullTitle: 'Risk analysis',
      shortTitle: 'Risks',
      icon: <RiskIcon />,
      link: '/scaling/risk',
      selected: props.selected === 'risk',
    },
  ]
  if (props.showActivity) {
    pages.push({
      fullTitle: 'Activity',
      shortTitle: 'Activity',
      icon: <ActivityIcon />,
      link: '/scaling/activity',
      selected: props.selected === 'activity',
    })
  }
  return <NavigationTabs pages={pages} />
}
