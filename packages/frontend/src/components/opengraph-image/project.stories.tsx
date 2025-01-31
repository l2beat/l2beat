import type { Meta, StoryObj } from '@storybook/react'
import { ProjectOpengraphImage } from './project'

const meta = {
  title: 'OG Images/Project',
  component: ProjectOpengraphImage,
} satisfies Meta<typeof ProjectOpengraphImage>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    baseUrl: 'https://l2beat.com',
    slug: 'arbitrum',
    name: 'Arbitrum',
    size: { width: 1200, height: 630 },
    children: 'SCALING • PROJECT PAGE',
  },
}
