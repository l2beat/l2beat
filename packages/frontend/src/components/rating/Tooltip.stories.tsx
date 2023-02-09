import { Layer2Rating } from '@l2beat/config'
import React, { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { configureTooltips } from '../../scripts/configureTooltips'
import { Tooltip as TooltipComponent } from '../Tooltip'
import { RatingTooltipPopup } from './TooltipPopup'

export default {
  title: 'Components/Tooltip',
}

export function RatingTooltip() {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    configureTooltips()
    // show tooltip
    tooltipRef.current?.dispatchEvent(new MouseEvent('mouseenter'))
    // remove all event listeners, leaving them will cause reg-viz to remove tooltip
    document.body.replaceWith(document.body.cloneNode(true))
    tooltipRef.current?.replaceWith(tooltipRef.current.cloneNode(true))
  }, [])

  const item: Layer2Rating = {
    category: {
      score: 'B',
      requirements: ['There is an existing fraud proof system'],
    },
    modifier: {
      score: '-',
      items: ['Validators are behind a whitelist'],
    },
    thingsToImprove: {
      improvedScore: 'A',
      requirements: ['There should be no instant upgradeability'],
    },
  }

  return (
    <div className="m-4 ml-32">
      <span
        ref={tooltipRef}
        className="Tooltip inline-block"
        title={renderToStaticMarkup(<RatingTooltipPopup item={item} />)}
        data-tooltip-big
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
