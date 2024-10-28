import { type Meta, type StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { MilestonesAndIncidentsSection } from './milestones-and-incidents-section'

const meta = {
  title: 'Components/Projects/Sections/Milestones & Incidents',
  component: MilestonesAndIncidentsSection,
  args: {
    id: 'milestones-and-incidents',
    title: 'Milestones & Incidents',
    sectionOrder: '1',
    milestones: [
      {
        name: 'Nitro upgrade is activated',
        link: 'https://l2beat.com',
        date: '2022-08-31T00:00:00Z',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
        type: 'general',
      },
      {
        name: 'Arbitrum Odyssey begins',
        link: 'https://l2beat.com',
        date: '2022-06-25T00:00:00Z',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
        type: 'incident',
      },
      {
        name: 'Creation of Arbitrum One',
        link: 'https://l2beat.com',
        date: '2019-11-14T00:00:00Z',
        type: 'general',
      },
    ],
  },
} satisfies Meta<typeof MilestonesAndIncidentsSection>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Expanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByText('Show more')
    await userEvent.click(button)
  },
}
