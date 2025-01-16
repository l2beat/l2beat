import { UnixTime } from '@l2beat/shared-pure'
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
        notSynced: [
          {
            content: 'Some random content saying that this is not synced',
            syncedUntil: UnixTime.now().add(-2, 'days').toNumber(),
          },
        ],
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
