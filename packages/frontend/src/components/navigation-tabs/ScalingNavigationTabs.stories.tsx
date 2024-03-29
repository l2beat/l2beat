import { Meta, StoryObj } from '@storybook/react'

import { ScalingNavigationTabs as ScalingNavigationTabsComponent } from './ScalingNavigationTabs'

const meta: Meta<typeof ScalingNavigationTabsComponent> = {
  component: ScalingNavigationTabsComponent,
}
export default meta
type Story = StoryObj<typeof ScalingNavigationTabsComponent>

export const ScalingNavigationTabs: Story = {
  args: {
    selected: 'summary',
    showActivity: true,
    showFinality: true,
    showLiveness: true,
  },
  argTypes: {
    selected: {
      control: 'radio',
      options: ['summary', 'risk', 'activity', 'liveness', 'finality', 'tvl'],
    },
  },
}
