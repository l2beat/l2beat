import { StageConfig } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { NoInfoCell } from '../table/NoInfoCell'
import { StageBadge } from './StageBadge'
import { StageTooltip } from './StageTooltip'

export interface StageCellProps {
  item?: StageConfig
}

export function StageCell({ item }: StageCellProps) {
  if (!item) {
    return <NoInfoCell />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<StageTooltip item={item} />)}
      data-tooltip-big
    >
      <StageBadge category={item.stage} small={true} />
    </div>
  )
}
