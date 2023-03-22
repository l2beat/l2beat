import { Layer2Maturity } from '@l2beat/config'
import React, { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { configureTooltips } from '../../scripts/configureTooltips'
import { Tooltip as TooltipComponent } from '../Tooltip'
import { MaturityTooltipPopup } from './TooltipPopup'

export default {
  title: 'Components/Tooltip',
}

export function MaturityTooltip() {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    configureTooltips()
    // show tooltip
    tooltipRef.current?.dispatchEvent(new MouseEvent('mouseenter'))
    // remove all event listeners, leaving them will cause reg-viz to remove tooltip
    document.body.replaceWith(document.body.cloneNode(true))
    tooltipRef.current?.replaceWith(tooltipRef.current.cloneNode(true))
  }, [])

  const item: Layer2Maturity = {
    stage: 'Stage 2',
    modifiers: [
      {
        value: 'Validators are behind a whitelist',
        sentiment: 'warning',
      },
      {
        value:
          'The code that secures the system can be changed arbitrarily & without notice',
        sentiment: 'bad',
      },
    ],
  }

  return (
    <div className="m-4 ml-32">
      <span
        ref={tooltipRef}
        className="Tooltip inline-block"
        title={renderToStaticMarkup(
          <MaturityTooltipPopup
            maturity={item}
            name="Arbitrum"
            technology="Optimistic Rollup"
          />,
        )}
        data-tooltip-big
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
