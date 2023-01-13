import React, { useEffect, useRef } from 'react'

import { Tooltip as TooltipComponent } from '../components/Tooltip'
import { configureTooltips } from '../scripts/configureTooltips'

export default {
  title: 'Components/Tooltip',
}

export function Tooltip() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    configureTooltips()
    // trigger the display of the tooltip
    ref.current?.dispatchEvent(new MouseEvent('mouseenter'))
  }, [])

  return (
    <div className="m-4">
      <span ref={ref} className="Tooltip inline-block" title="Tooltip content">
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
