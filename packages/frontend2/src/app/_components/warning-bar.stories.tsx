import { type Meta, type StoryObj } from '@storybook/react'
import { WarningBar } from './warning-bar'

const meta = {
  component: WarningBar,
  args: {
    text: 'This is an example text for the warning.',
  },
} satisfies Meta<typeof WarningBar>
export default meta
type Story = StoryObj<typeof meta>

export const Yellow: Story = {
  args: {
    color: 'yellow',
  },
}

export const Red: Story = {
  args: {
    color: 'red',
  },
}

export const Critical: Story = {
  args: {
    color: 'red',
    isCritical: true,
  },
}

export const YellowWithLink: Story = {
  args: {
    color: 'yellow',
    href: 'https://example.com',
  },
}
