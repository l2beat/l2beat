import React from 'react'

import { ActivityIcon, RiskIcon, TvlIcon } from './icons'
import { PageSelection } from './PageSelection'

interface ScalingPageSelectionProps {
  selected: 'tvl' | 'risk' | 'activity'
  showActivity: boolean
}

export function ScalingPageSelection(props: ScalingPageSelectionProps) {
  const pages = [
    {
      content: 'Total Value Locked',
      icon: <TvlIcon />,
      link: '/scaling/tvl',
      selected: props.selected === 'tvl',
    },
    {
      content: 'Risk analysis',
      icon: <RiskIcon />,
      link: '/scaling/risk',
      selected: props.selected === 'risk',
    },
  ]
  if (props.showActivity) {
    pages.push({
      content: 'Activity',
      icon: <ActivityIcon />,
      link: '/scaling/activity',
      selected: props.selected === 'activity',
    })
  }
  return <PageSelection pages={pages} />
}
