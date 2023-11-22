import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../.storybook/modes'
import { configureTooltips } from '../scripts/configureTooltips'
import { AnomalyIndicator, AnomalyIndicatorEntry } from './AnomalyIndicator'
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
          <Story /> <Tooltip withAnimation={false} />
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
        type: 'BATCH SUBMISSION',
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
        type: 'BATCH SUBMISSION',
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
    await waitFor(async () => {
      await userEvent.hover(canvas.getByTestId('anomaly-indicator'))
    })
  },
}

export const NoData: Story = {
  args: {
    anomalyEntries: [],
  },
}
