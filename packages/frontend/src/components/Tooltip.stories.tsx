import React, { useEffect } from 'react'

import { Tooltip as TooltipComponent } from '../components/Tooltip'
import { configureTooltips } from '../scripts/configureTooltips'
import { hoverOver } from '../utils/storybook/hoverOver'

export default {
  title: 'Components/Tooltip',
}

export function Tooltip() {
  useEffect(() => {
    configureTooltips()
    hoverOver('.Tooltip')
  }, [])

  return (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title="Et sunt qui cupidatat minim aliqua occaecat labore elit. Reprehenderit cupidatat culpa aliqua mollit. Adipisicing tempor reprehenderit laborum enim aliquip Lorem excepteur."
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  )
}
