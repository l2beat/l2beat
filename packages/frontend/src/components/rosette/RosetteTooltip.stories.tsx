import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { configureTooltips } from '../../scripts/configureTooltips'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { TooltipProvider as TooltipComponent } from '../tooltip/TooltipProvider'
import { RosetteTooltipPopup, RosetteTooltipProps } from './TooltipPopup'

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

const project: RosetteTooltipProps = {
  riskSentiments: {
    proposerFailure: 'bad',
    exitWindow: 'bad',
    sequencerFailure: 'good',
    dataAvailability: 'warning',
    stateValidation: 'good',
  },
  riskValues: {
    stateValidation: {
      value: 'Fraud proofs',
      sentiment: 'good',
    },
    proposerFailure: {
      value: 'No mechanism',
      sentiment: 'bad',
    },
    exitWindow: {
      value: 'Yes',
      sentiment: 'bad',
    },
    sequencerFailure: {
      value: 'Transact using L1',
      sentiment: 'good',
    },
    dataAvailability: {
      value: 'Optimistic',
      sentiment: 'warning',
    },
  },
}

export const RosetteTooltip: Story = {
  render: () => (
    <div className="m-4 ml-32">
      <Tooltip className="inline-block" big>
        <TooltipTrigger>Element with tooltip</TooltipTrigger>
        <TooltipContent>
          <RosetteTooltipPopup
            riskSentiments={project.riskSentiments}
            riskValues={project.riskValues}
          />
        </TooltipContent>
      </Tooltip>
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
