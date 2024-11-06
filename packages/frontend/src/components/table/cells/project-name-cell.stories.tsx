import { type Meta, type StoryObj } from '@storybook/react'
import { ProjectNameCell } from './project-name-cell'

const meta = {
  title: 'Components/ProjectNameCell',
  component: ProjectNameCell,
} satisfies Meta<typeof ProjectNameCell>

export default meta
type Story = StoryObj<typeof ProjectNameCell>

export const All: Story = {
  args: {
    project: {
      name: 'All Features Project',
      shortName: 'AFP',
      isVerified: false,
      redWarning: 'Red warning message',
      underReviewStatus: 'config',
      data: {
        syncStatus: {
          isSynced: false,
          syncedUntil: 1714857600,
        },
      },
    },
  },
}

export const Layer3: Story = {
  args: {
    project: {
      name: 'Layer3 Project',
      hostChain: 'Arbitrum One',
    },
  },
}
