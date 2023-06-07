import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { NoInfoCell } from '../table/NoInfoCell'
import { StageBadge } from './StageBadge'
import { StageTooltip } from './StageTooltip'

export function StageCell({ item }: StageTooltip) {
  if (!item) {
    return <NoInfoCell />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<StageTooltip item={item} />)}
      data-tooltip-big
    >
      <StageBadge category={item.stage} />
    </div>
  )
}
