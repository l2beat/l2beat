import { type Meta, type StoryObj } from '@storybook/react'
import { onlyDesktopModes } from '~/../.storybook/modes'
import { Select } from './select'

const meta = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
  args: {
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[180px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    value: 'option2',
  },
}

export const Disabled: Story = {
  args: {
    title: 'Select an option',
    disabled: true,
  },
}
