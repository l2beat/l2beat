import React from 'react'

import { ActivityIcon, RiskIcon, SummaryIcon, TvlIcon } from '../icons'
import { NavigationPage, NavigationTabs } from './NavigationTabs'

interface ScalingNavigationTabsProps {
  selected: 'summary' | 'detailed' | 'risk' | 'activity'
  showActivity: boolean
  showDetailedTvl?: boolean
}

export function ScalingNavigationTabs(props: ScalingNavigationTabsProps) {
  const pages: NavigationPage[] = [
    {
      fullTitle: 'Summary',
      shortTitle: 'Summary',
      icon: <SummaryIcon />,
      link: '/scaling/summary',
      selected: props.selected === 'summary',
    },
  ]
  if (props.showDetailedTvl) {
    pages.push({
      fullTitle: 'Value Locked',
      shortTitle: 'Value',
      icon: <TvlIcon />,
      link: '/scaling/detailedTvl',
      selected: props.selected === 'detailed',
    })
  }

  pages.push({
    fullTitle: 'Risk Analysis',
    shortTitle: 'Risks',
    icon: <RiskIcon />,
    link: '/scaling/risk',
    selected: props.selected === 'risk',
  })
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
