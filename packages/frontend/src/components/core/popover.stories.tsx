import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const meta = {
  title: 'Atoms/Popover',
  component: Popover,
  decorators: [
    (Story) => {
      return (
        <div className="ml-32">
          <Story />
        </div>
      )
    },
  ],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>Click me</PopoverTrigger>
      <PopoverContent>
        <p>This is the popover content.</p>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Click me'))
  },
}
