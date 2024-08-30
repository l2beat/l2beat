import { type Meta, type StoryObj } from '@storybook/react'
import { ProjectNameCell } from './project-name-cell'

const meta = {
  title: 'Components/ProjectNameCell',
  component: ProjectNameCell,
  argTypes: {
    type: {
      control: 'select',
      options: ['layer2', 'layer3', 'bridge'],
    },
    showIsL3: {
      control: 'boolean',
    },
  },
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
      showProjectUnderReview: true,
      hasImplementationChanged: true,
      warning: 'General warning message',
      data: {
        syncStatus: {
          isSynced: false,
          syncedUntil: 1714857600,
        },
      },
    },
    type: 'layer3',
    showIsL3: true,
  },
}
