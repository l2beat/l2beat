import type { Meta, StoryObj } from '@storybook/react'
import { About } from './about'

const meta = {
  title: 'Components/About',
  component: About,
} satisfies Meta<typeof About>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
