import { Meta, StoryObj } from '@storybook/react'

import { MilestonesSection } from './MilestonesSection'

const meta: Meta<typeof MilestonesSection> = {
  component: MilestonesSection,
}
export default meta
type Story = StoryObj<typeof MilestonesSection>

export const Collapsed: Story = {
  args: {
    milestones: [
      {
        name: 'Creation of Arbitrum One',
        link: 'https://l2beat.com',
        date: '2019-11-14T00:00:00Z',
      },
      {
        name: 'Arbitrum Odyssey begins',
        link: 'https://l2beat.com',
        date: '2022-06-25T00:00:00Z',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
      },
      {
        name: 'Nitro upgrade is activated',
        link: 'https://l2beat.com',
        date: '2022-08-31T00:00:00Z',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
      },
    ],
  },
}
