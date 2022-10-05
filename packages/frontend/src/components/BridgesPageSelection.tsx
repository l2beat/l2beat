import React from 'react'

import { RiskIcon, TvlIcon } from './icons'
import { PageSelection } from './PageSelection'

interface BridgesPageSelectionProps {
  selected: 'tvl' | 'risk'
}

export function BridgesPageSelection(props: BridgesPageSelectionProps) {
  return (
    <PageSelection
      pages={[
        {
          content: 'Total Value Locked',
          icon: <TvlIcon />,
          link: '/bridges/tvl',
          selected: props.selected === 'tvl',
        },
        {
          icon: <RiskIcon />,
          content: 'Risk analysis',
          link: '/bridges/risk',
          selected: props.selected === 'risk',
        },
      ]}
    />
  )
}
