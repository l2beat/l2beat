import { Meta, StoryObj } from '@storybook/react'

import { LinkWithThumbnail } from './LinkWithThumbnail'

const meta: Meta<typeof LinkWithThumbnail> = {
  component: LinkWithThumbnail,
}
export default meta
type Story = StoryObj<typeof LinkWithThumbnail>

export const Primary: Story = {
  args: {
    href: 'https://l2beat.com',
    src: '/images/thumbnails/default.jpg',
    title: 'An example link with thumbnail',
  },
}
