import { Meta, StoryObj } from '@storybook/react'

import { WarningBar as WarningBarComponent } from './WarningBar'

const meta: Meta<typeof WarningBarComponent> = {
  component: WarningBarComponent,
}
export default meta
type Story = StoryObj<typeof WarningBarComponent>

const text = 'This is an example text for the warning.'

export const Yellow: Story = {
  args: {
    color: 'yellow',
    isCritical: false,
    text,
  },
}

export const Red: Story = {
  args: {
    color: 'red',
    isCritical: false,
    text,
  },
}

export const Critical: Story = {
  args: {
    color: 'red',
    isCritical: true,
    text,
  },
}

export const YellowWithLink: Story = {
  args: {
    color: 'yellow',
    isCritical: false,
    text,
    href: 'https://example.com',
  },
}
