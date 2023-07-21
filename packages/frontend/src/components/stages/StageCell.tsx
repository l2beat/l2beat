import { StageConfig } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { StageBadge } from './StageBadge'
import { StageTooltip } from './StageTooltip'

export interface StageCellProps {
  item?: StageConfig
}

export function StageCell({ item }: StageCellProps) {
  if (!item) {
    return <StageBadge stage={undefined} oneSize />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<StageTooltip item={item} />)}
      data-tooltip-big
      data-tooltip-mobile-disabled
    >
      <StageBadge stage={item.stage} oneSize />
    </div>
  )
}
