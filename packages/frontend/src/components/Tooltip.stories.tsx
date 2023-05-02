import React, { useEffect } from 'react'

import { Story } from '@storybook/react'
import { Tooltip as TooltipComponent } from '../components/Tooltip'
import { configureTooltips } from '../scripts/configureTooltips'

export default {
  title: 'Components/Tooltip',
}

function Tooltip() {
  useEffect(() => {
    configureTooltips()
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

export const TooltipStory: Story = () => <Tooltip />
TooltipStory.story = {
  parameters: {
    screenshot: {
      variants: {
        hovered: { hover: '.Tooltip' },
      },
    },
  },
}
