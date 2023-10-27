import { Meta, StoryObj } from '@storybook/react'

import { RiskSection as RiskSectionComponent } from './RiskSection'

const meta: Meta<typeof RiskSectionComponent> = {
  component: RiskSectionComponent,
  args: {
    id: 'risk-analysis',
    title: 'Risks summary',
  },
}
export default meta
type Story = StoryObj<typeof RiskSectionComponent>

export const RiskSection: Story = {
  args: {
    riskGroups: [
      {
        name: 'Funds can be stolen if',
        start: 1,
        items: [
          {
            text: 'an invalid state root is submitted to the system,',
            isCritical: true,
            referencedId: '',
          },
          {
            text: 'a contract receives a malicious code upgrade. There is no delay on code upgrades.',
            isCritical: true,
            referencedId: '',
          },
        ],
      },
      {
        name: 'Funds can be frozen if',
        start: 3,
        items: [
          {
            text: 'the centralized validator goes down. Users cannot produce blocks themselves and exiting the system requires new block production.',
            isCritical: true,
            referencedId: '',
          },
        ],
      },
      {
        name: 'MEV can be extracted if',
        start: 4,
        items: [
          {
            text: 'the operator exploits their centralized position and frontruns user transactions.',
            isCritical: false,
            referencedId: '',
          },
        ],
      },
    ],
  },
}
