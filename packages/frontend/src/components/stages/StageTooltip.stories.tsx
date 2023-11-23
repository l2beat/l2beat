import { StageConfig } from '@l2beat/config'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { configureTooltips } from '../../scripts/configureTooltips'
import { Tooltip as TooltipComponent } from '../Tooltip'
import { StageTooltip as StageTooltipComponent } from './StageTooltip'

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
          <TooltipComponent withAnimation={false} />
        </div>
      )
    },
  ],
}
export default meta
type Story = StoryObj<typeof TooltipComponent>

const item: StageConfig = {
  stage: 'Stage 1',
  missing: {
    nextStage: 'Stage 2',
    requirements: ['A requirement'],
  },
  summary: [],
}

export const Tooltip: Story = {
  render: () => (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(<StageTooltipComponent item={item} />)}
        data-tooltip-big
      >
        <span>Element with tooltip</span>
      </span>
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
