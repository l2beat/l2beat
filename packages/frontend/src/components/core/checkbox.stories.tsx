import type { Meta, StoryObj } from '@storybook/react'
import { onlyDesktopModes } from '~/../.storybook/modes'
import { Checkbox } from './checkbox'

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
    name: 'unchecked',
    children: 'Unchecked',
  },
}

export const Checked: Story = {
  args: {
    name: 'checked',
    children: 'Checked',
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    name: 'disabled',
    children: 'Disabled',
    disabled: true,
  },
}
