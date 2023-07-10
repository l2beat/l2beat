import React, { useEffect } from 'react'

import { Tooltip as TooltipComponent } from '../components/Tooltip'
import { testConfigureTooltipsAndShow } from '../scripts/configureTooltips'

export default {
  title: 'Components/Tooltip',
  parameters: {
    screenshot: {
      delay: 200,
    },
  },
}

export function Tooltip() {
  useEffect(() => {
    testConfigureTooltipsAndShow()
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
