import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { configureTooltips } from '../../scripts/configureTooltips'
import { Tooltip as TooltipComponent } from '../Tooltip'
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
          <TooltipComponent />
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
    upgradeability: 'bad',
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
    upgradeability: {
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
      <span
        className="Tooltip inline-block"
        title={renderToStaticMarkup(
          <RosetteTooltipPopup
            riskSentiments={project.riskSentiments}
            riskValues={project.riskValues}
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
    const tooltip = canvas.getByText('Element with tooltip')
    // Wait for the tooltip to appear
    await new Promise((resolve) => setTimeout(resolve, 200))
    await waitFor(async () => {
      await userEvent.hover(tooltip)
    })
  },
}
