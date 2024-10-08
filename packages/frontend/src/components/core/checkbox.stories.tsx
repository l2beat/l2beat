import { type Meta, type StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'
import { onlyDesktopModes } from '.storybook/modes'

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
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

export const Disabled: Story = {
  args: {
    id: 'disabled',
    children: 'Disabled',
    disabled: true,
  },
}
