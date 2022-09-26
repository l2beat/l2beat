import React from 'react'

import { ActivityIcon } from './icons/symbols/ActivityIcon'
import { RiskIcon } from './icons/symbols/RiskIcon'
import { TvlIcon } from './icons/symbols/TvlIcon'
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
