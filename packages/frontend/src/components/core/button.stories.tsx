import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title: 'Atoms/Button',
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

export const Outline: Story = {
  args: {
    children: 'Label',
    variant: 'outline',
  },
}
