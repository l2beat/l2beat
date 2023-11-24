import { Meta, StoryObj } from '@storybook/react'

import { RiskList as RiskListComponent } from './RiskList'

const meta: Meta<typeof RiskListComponent> = {
  component: RiskListComponent,
}
export default meta
type Story = StoryObj<typeof RiskListComponent>

export const RiskList: Story = {
  args: {
    risks: [
      {
        text: 'Funds can be stolen if a contract receives a malicious code upgrade. There is no delay on code upgrades.',
        isCritical: true,
      },
      {
        text: 'MEV can be extracted if the operator exploits their centralized position and frontruns user transactions.',
        isCritical: false,
      },
    ],
  },
}
