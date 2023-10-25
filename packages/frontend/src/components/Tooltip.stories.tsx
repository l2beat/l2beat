import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { Tooltip as TooltipComponent } from '../components/Tooltip'
import { configureTooltips } from '../scripts/configureTooltips'

const meta: Meta<typeof TooltipComponent> = {
  component: TooltipComponent,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
      }, [])
      return <Story />
    },
  ],
  parameters: {
    chromatic: {
      delay: 250,
    },
  },
}
export default meta
type Story = StoryObj<typeof TooltipComponent>

export const Tooltip: Story = {
  render: () => (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title="Et sunt qui cupidatat minim aliqua occaecat labore elit. Reprehenderit cupidatat culpa aliqua mollit. Adipisicing tempor reprehenderit laborum enim aliquip Lorem excepteur."
      >
        <span>Element with tooltip</span>
      </span>
      <TooltipComponent />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tooltip = canvas.getByText('Element with tooltip')
    await waitFor(async () => {
      await userEvent.hover(tooltip)
    })
  },
}
