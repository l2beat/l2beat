import { type Meta, type StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { AnomalyIndicator } from './anomaly-indicator'

const meta = {
  title: 'Components/AnomalyIndicator',
  component: AnomalyIndicator,
  args: {
    anomalies: [
      {
        timestamp: 1696758992,
        durationInSeconds: 120 * 60,
        type: 'stateUpdates',
      },
      {
        timestamp: 1697277392,
        durationInSeconds: 20 * 60,
        type: 'batchSubmissions',
      },
      {
        timestamp: 1697363792,
        durationInSeconds: 1440 * 60,
        type: 'stateUpdates',
      },
      {
        timestamp: 1697622992,
        durationInSeconds: 180 * 60,
        type: 'stateUpdates',
      },
      {
        timestamp: 1698054992,
        durationInSeconds: 45 * 60,
        type: 'batchSubmissions',
      },
      {
        timestamp: 1698227792,
        durationInSeconds: 15 * 60,
        type: 'stateUpdates',
      },
      {
        timestamp: 1698663392,
        durationInSeconds: 75 * 60,
        type: 'stateUpdates',
      },
    ],
  },
} satisfies Meta<typeof AnomalyIndicator>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const anomalyIndicator = canvas.getByTitle('Anomalies in the last 30 days')
    await userEvent.hover(anomalyIndicator)
  },
}

export const ComingSoon: Story = {
  args: {
    showComingSoon: true,
  },
}
