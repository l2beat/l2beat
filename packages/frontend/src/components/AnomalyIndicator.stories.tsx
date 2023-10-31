import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../.storybook/modes'
import { configureTooltips } from '../scripts/configureTooltips'
import { AnomalyIndicator } from './AnomalyIndicator'
import { Tooltip } from './Tooltip'

const meta: Meta<typeof AnomalyIndicator> = {
  component: AnomalyIndicator,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
      })

      return (
        <>
          <Story /> <Tooltip />
        </>
      )
    },
  ],
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
}
export default meta
type Story = StoryObj<typeof AnomalyIndicator>

const anomalies = [
  { isAnomaly: true, timestamp: 1696758992, durationInMinutes: 120 } as const,
  { isAnomaly: true, timestamp: 1697277392, durationInMinutes: 20 } as const,
  { isAnomaly: false } as const,
  { isAnomaly: true, timestamp: 1697363792, durationInMinutes: 1440 } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: true, timestamp: 1697622992, durationInMinutes: 180 } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: true, timestamp: 1698054992, durationInMinutes: 45 } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: true, timestamp: 1698227792, durationInMinutes: 15 } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: true, timestamp: 1698663392, durationInMinutes: 75 } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
]

export const Default: Story = {
  args: {
    anomalies: anomalies,
  },
}

export const WithTooltip: Story = {
  args: {
    anomalies: anomalies,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tooltip = canvas.getByTestId('anomaly-indicator')
    // Wait for the tooltip to appear
    await new Promise((resolve) => setTimeout(resolve, 200))
    await waitFor(async () => {
      await userEvent.hover(tooltip)
    })
  },
}

export const NoData: Story = {
  args: {
    anomalies: [],
  },
}
