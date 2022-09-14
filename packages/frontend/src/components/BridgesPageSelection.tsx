import React from 'react'

import { RiskIcon } from './icons/symbols/RiskIcon'
import { TvlIcon } from './icons/symbols/TvlIcon'
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
          content: 'Rissk analysis',
          link: '/bridges/risk',
          selected: props.selected === 'risk',
        },
      ]}
    />
  )
}
