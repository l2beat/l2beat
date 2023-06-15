import { StageConfig } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { NoInfoCell } from '../table/NoInfoCell'
import { StageBadge } from './StageBadge'
import { StageTooltip } from './StageTooltip'

export interface StageCellProps {
  item?: StageConfig | 'UnderReview'
}

export function StageCell({ item }: StageCellProps) {
  if (!item) {
    return <NoInfoCell />
  }

  //TODO: implement under review
  if (item === 'UnderReview') {
    return <span>Under Review</span>
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<StageTooltip item={item} />)}
      data-tooltip-big
    >
      <StageBadge stage={item.stage} small={true} />
    </div>
  )
}
