import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { MaturityBadge } from '../maturity/Badge'
import { MaturityProps, MaturityTooltipPopup } from '../maturity/TooltipPopup'

export function MaturityCell({ maturity, name, technology }: MaturityProps) {
  if (!maturity || !name || !technology) {
    return <MaturityBadge maturity={maturity} />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(
        <MaturityTooltipPopup
          maturity={maturity}
          name={name}
          technology={technology}
        />,
      )}
      data-tooltip-big
    >
      <MaturityBadge maturity={maturity} />
    </div>
  )
}
