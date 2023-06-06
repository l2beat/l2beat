import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { StageBadge } from '../stages/Badge'
import { StageTooltipPopup, StageTooltipProps } from '../stages/TooltipPopup'
import { NoInfoCell } from './NoInfoCell'

export function StageCell({ item }: StageTooltipProps) {
  if (!item) {
    return <NoInfoCell />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<StageTooltipPopup item={item} />)}
      data-tooltip-big
    >
      <StageBadge category={item.stage} />
    </div>
  )
}
