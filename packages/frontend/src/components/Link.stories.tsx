import { Meta, StoryObj } from '@storybook/react'

import { Link } from './Link'

const meta: Meta<typeof Link> = {
  component: Link,
}
export default meta
type Story = StoryObj<typeof Link>

export const Primary: Story = {
  args: {
    children: 'Example link',
  },
}

export const Danger: Story = {
  args: {
    children: 'Example link',
    type: 'danger',
  },
}

export const Plain: Story = {
  args: {
    children: 'Example link',
    type: 'plain',
  },
}

export const WithArrow: Story = {
  args: {
    children: 'Example link',
    showArrow: true,
  },
}

export const WithoutUnderline: Story = {
  args: {
    children: 'Example link',
    underline: false,
  },
}

export const Highlighted: Story = {
  args: {
    children: 'Example link',
    //@ts-ignore
    'data-state': 'highlighted',
  },
}
