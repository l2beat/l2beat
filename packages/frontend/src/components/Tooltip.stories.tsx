import React, { useEffect, useRef } from 'react'

import { Tooltip as TooltipComponent } from '../components/Tooltip'
import { configureTooltips } from '../scripts/configureTooltips'

export default {
  title: 'Components/Tooltip',
}

export function Tooltip() {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    configureTooltips()
    // show tooltip
    tooltipRef.current?.dispatchEvent(new MouseEvent('mouseenter'))
    // remove all event listeners, leaving them will cause reg-viz to remove tooltip
    document.body.replaceWith(document.body.cloneNode(true))
    tooltipRef.current?.replaceWith(tooltipRef.current.cloneNode(true))
  }, [])

  return (
    <div className="m-4 ml-32">
      <span
        ref={tooltipRef}
        className="Tooltip inline-block"
        title="Et sunt qui cupidatat minim aliqua occaecat labore elit. Reprehenderit cupidatat culpa aliqua mollit. Adipisicing tempor reprehenderit laborum enim aliquip Lorem excepteur."
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
