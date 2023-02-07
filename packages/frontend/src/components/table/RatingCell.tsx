import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { RatingBadge } from '../rating/Badge'
import { RatingProps, RatingTooltipPopup } from '../rating/TooltipPopup'
import { NoInfoCell } from './NoInfoCell'

export function RatingCell({ item }: RatingProps) {
  if (!item) {
    return <NoInfoCell />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<RatingTooltipPopup item={item} />)}
      data-tooltip-big={true}
    >
      <RatingBadge
        category={item.category.score}
        modifier={item.modifier?.score}
      />
    </div>
  )
}
