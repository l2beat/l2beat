import type { Meta, StoryObj } from '@storybook/react'
import { LinkWithThumbnail } from './link-with-thumbnail'

const meta = {
  title: 'Components/Link With Thumbnail',
  component: LinkWithThumbnail,
  args: {
    href: 'https://l2beat.com',
    src: '/images/thumbnails/default.jpg',
    title: 'An example link with thumbnail',
    description: 'This is a description of the example link with thumbnail',
  },
} satisfies Meta<typeof LinkWithThumbnail>
export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
}
