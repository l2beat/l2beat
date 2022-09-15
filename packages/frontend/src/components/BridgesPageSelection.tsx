import React from 'react'

import { RiskIcon } from './icons/symbols/RiskIcon'
import { PageSelection } from './PageSelection'

export function BridgesPageSelection() {
  return (
    <PageSelection
      pages={[
        {
          icon: <RiskIcon />,
          content: 'Risk analysis',
          link: '/bridges/risk',
          selected: true,
        },
      ]}
    />
  )
}
