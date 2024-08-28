import { type StoryObj } from '@storybook/react'
import { CustomLink } from './custom-link'

const meta = {
  title: 'UI/Atoms/Link',
  component: CustomLink,
}
export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Example link',
    href: '/',
  },
}

export const Danger: Story = {
  args: {
    children: 'Example link',
    href: '/',
    variant: 'danger',
  },
}

export const Plain: Story = {
  args: {
    children: 'Example link',
    href: '/',
    variant: 'plain',
  },
}

export const WithoutUnderline: Story = {
  args: {
    children: 'Example link',
    href: '/',
    underline: false,
  },
}
