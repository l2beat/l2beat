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
      statuses: {
        underReview: 'config',
        redWarning: 'Red warning message',
        verificationWarning: true,
        syncStatusInfo: 'Sync status info',
      },
    },
  },
}

export const Layer3: Story = {
  args: {
    project: {
      name: 'Layer3 Project',
      nameSecondLine: 'Arbitrum One',
      statuses: undefined,
    },
  },
}
