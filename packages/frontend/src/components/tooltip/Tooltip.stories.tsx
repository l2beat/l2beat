import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { configureTooltips } from '../../scripts/configureTooltips'
import { Tooltip as TooltipComponent } from './Tooltip'
import { TooltipProvider } from './TooltipProvider'

const meta: Meta<typeof TooltipComponent> = {
  component: TooltipComponent,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
      }, [])
      return (
        <div>
          <Story />
          <TooltipProvider withAnimation={false} />
        </div>
      )
    },
  ],
}
export default meta
type Story = StoryObj<typeof TooltipComponent>

export const Primary: Story = {
  render: () => (
    <div className="m-4 ml-32">
      <TooltipComponent
        className="inline-block"
        content="Et sunt qui cupidatat minim aliqua occaecat labore elit. Reprehenderit cupidatat culpa aliqua mollit. Adipisicing tempor reprehenderit laborum enim aliquip Lorem excepteur."
      >
        <span>Element with tooltip</span>
      </TooltipComponent>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Wait for the tooltip to appear
    await new Promise((resolve) => setTimeout(resolve, 200))
    await waitFor(async () => {
      await userEvent.hover(canvas.getByText('Element with tooltip'))
    })
  },
}
