import React from 'react'

import { RiskIcon } from './icons/symbols/RiskIcon'
import { TvlIcon } from './icons/symbols/TvlIcon'
import { PageSelection } from './PageSelection'

interface ScalingPageSelectionProps {
  selected: 'tvl' | 'risk'
}

export function ScalingPageSelection(props: ScalingPageSelectionProps) {
  return (
    <PageSelection
      pages={[
        {
          content: 'Total Value Locked',
          icon: <TvlIcon />,
          link: '/scaling/tvl',
          selected: props.selected === 'tvl',
        },
        {
          icon: <RiskIcon />,
          content: 'Risk analysis',
          link: '/scaling/risk',
          selected: props.selected === 'risk',
        },
      ]}
    />
  )
}
