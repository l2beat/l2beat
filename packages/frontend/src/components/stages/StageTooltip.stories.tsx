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

export const Primary: Story = {
  render: () => (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(
          <StageTooltipComponent
            stageConfig={{
              stage: 'Stage 1',
              missing: {
                nextStage: 'Stage 2',
                requirements: ['A requirement'],
              },
              message: undefined,
              summary: [],
            }}
          />,
        )}
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

export const WithWarning: Story = {
  render: () => (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(
          <StageTooltipComponent
            stageConfig={{
              stage: 'Stage 0',
              missing: {
                nextStage: 'Stage 1',
                requirements: ['A requirement'],
              },
              message: {
                type: 'warning',
                text: 'Warning text',
              },
              summary: [],
            }}
          />,
        )}
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

export const WithUnderReview: Story = {
  render: () => (
    <div className="m-4 ml-32">
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(
          <StageTooltipComponent
            stageConfig={{
              stage: 'Stage 0',
              missing: {
                nextStage: 'Stage 1',
                requirements: ['A requirement'],
              },
              message: {
                type: 'underReview',
                text: 'Under review text',
              },
              summary: [],
            }}
          />,
        )}
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
