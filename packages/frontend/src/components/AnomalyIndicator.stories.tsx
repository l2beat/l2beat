import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../.storybook/modes'
import { AnomalyIndicatorEntry } from '../pages/scaling/liveness/types'
import { configureTooltips } from '../scripts/configureTooltips'
import { AnomalyIndicator } from './AnomalyIndicator'
import { TooltipProvider } from './tooltip/TooltipProvider'

const meta: Meta<typeof AnomalyIndicator> = {
  component: AnomalyIndicator,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
      })

      return (
        <>
          <Story /> <TooltipProvider withAnimation={false} />
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

const anomalies: AnomalyIndicatorEntry[] = [
  {
    isAnomaly: true,
    anomalies: [
      {
        timestamp: 1696758992,
        durationInSeconds: 120 * 60,
        type: 'STATE UPDATE',
      },
    ],
  },
  {
    isAnomaly: true,
    anomalies: [
      {
        timestamp: 1697277392,
        durationInSeconds: 20 * 60,
        type: 'TX DATA SUBMISSION',
      },
    ],
  },
  { isAnomaly: false },
  {
    isAnomaly: true,
    anomalies: [
      {
        timestamp: 1697363792,
        durationInSeconds: 1440 * 60,
        type: 'STATE UPDATE',
      },
    ],
  },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  {
    isAnomaly: true,
    anomalies: [
      {
        timestamp: 1697622992,
        durationInSeconds: 180 * 60,
        type: 'STATE UPDATE',
      },
    ],
  },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  {
    isAnomaly: true,
    anomalies: [
      {
        timestamp: 1698054992,
        durationInSeconds: 45 * 60,
        type: 'TX DATA SUBMISSION',
      },
    ],
  },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  {
    isAnomaly: true,
    anomalies: [
      {
        timestamp: 1698227792,
        durationInSeconds: 15 * 60,
        type: 'STATE UPDATE',
      },
    ],
  },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  {
    isAnomaly: true,
    anomalies: [
      {
        timestamp: 1698663392,
        durationInSeconds: 75 * 60,
        type: 'STATE UPDATE',
      },
    ],
  },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
  { isAnomaly: false },
]

export const Default: Story = {
  args: {
    anomalyEntries: anomalies,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Wait for the tooltip to appear
    await new Promise((resolve) => setTimeout(resolve, 200))
    await waitFor(async () => {
      await userEvent.hover(
        canvas.getByTestId('anomaly-indicator-tooltip-trigger'),
      )
    })
  },
}

export const NoData: Story = {
  args: {
    anomalyEntries: [],
  },
}
