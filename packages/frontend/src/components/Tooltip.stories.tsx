import React, { useEffect, useRef } from 'react'

import { Tooltip as TooltipComponent } from '../components/Tooltip'
import { configureTooltips } from '../scripts/configureTooltips'
import { hoverOver } from '../utils/storybook/hoverOver'

export default {
  title: 'Components/Tooltip',
}

export function Tooltip() {
  const tooltipRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    configureTooltips()
    hoverOver(tooltipRef)
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
