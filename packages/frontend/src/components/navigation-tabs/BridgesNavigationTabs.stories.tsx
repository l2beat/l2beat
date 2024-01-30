import { Meta, StoryObj } from '@storybook/react'

import { BridgesNavigationTabs as BridgesNavigationTabsComponent } from './BridgesNavigationTabs'

const meta: Meta<typeof BridgesNavigationTabsComponent> = {
  component: BridgesNavigationTabsComponent,
}
export default meta
type Story = StoryObj<typeof BridgesNavigationTabsComponent>

export const BridgesNavigationTabs: Story = {
  args: {
    selected: 'summary',
  },
  argTypes: {
    selected: {
      control: 'radio',
      options: ['summary', 'risk', 'activity'],
    },
  },
}
