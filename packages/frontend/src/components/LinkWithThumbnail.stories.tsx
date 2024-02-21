import { Meta, StoryObj } from '@storybook/react'

import { LinkWithThumbnail } from './LinkWithThumbnail'

const meta: Meta<typeof LinkWithThumbnail> = {
  component: LinkWithThumbnail,
  args: {
    href: 'https://l2beat.com',
    src: '/images/thumbnails/default.jpg',
    title: 'An example link with thumbnail',
    description: 'This is a description of the example link with thumbnail',
  },
}
export default meta
type Story = StoryObj<typeof LinkWithThumbnail>

export const Primary: Story = {}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
}
