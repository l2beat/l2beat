import { type Meta, type StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title: 'UI/Atoms/Button',
  component: Button,
} satisfies Meta<typeof Button>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Label',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export const Purple: Story = {
  args: {
    children: 'Label',
    variant: 'purple',
  },
}
