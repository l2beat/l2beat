import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { MaturityBadge } from '../maturity/Badge'
import { MaturityProps, MaturityTooltipPopup } from '../maturity/TooltipPopup'
import { NoInfoCell } from './NoInfoCell'

export function MaturityCell({ item }: MaturityProps) {
  if (!item) {
    return <NoInfoCell />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<MaturityTooltipPopup item={item} />)}
      data-tooltip-big
    >
      <MaturityBadge
        category={item.category.score}
        modifier={item.modifier?.score}
      />
    </div>
  )
}
