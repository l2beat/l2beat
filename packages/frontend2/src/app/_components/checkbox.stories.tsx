import { type Meta, type StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'

const meta = {
  title: 'UI/Atoms/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>
export default meta

type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
  args: {
    id: 'unchecked',
    children: 'Unchecked',
  },
}

export const Checked: Story = {
  args: {
    id: 'checked',
    children: 'Checked',
    checked: true,
  },
}
