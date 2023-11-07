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
  {
    isAnomaly: true,
    timestamp: 1696758992,
    durationInSeconds: 120 * 60,
  } as const,
  {
    isAnomaly: true,
    timestamp: 1697277392,
    durationInSeconds: 20 * 60,
  } as const,
  { isAnomaly: false } as const,
  {
    isAnomaly: true,
    timestamp: 1697363792,
    durationInSeconds: 1440 * 60,
  } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  {
    isAnomaly: true,
    timestamp: 1697622992,
    durationInSeconds: 180 * 60,
  } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  {
    isAnomaly: true,
    timestamp: 1698054992,
    durationInSeconds: 45 * 60,
  } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  {
    isAnomaly: true,
    timestamp: 1698227792,
    durationInSeconds: 15 * 60,
  } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  { isAnomaly: false } as const,
  {
    isAnomaly: true,
    timestamp: 1698663392,
    durationInSeconds: 75 * 60,
  } as const,
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
