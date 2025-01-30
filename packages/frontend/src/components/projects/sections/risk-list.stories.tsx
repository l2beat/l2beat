import type { Meta, StoryObj } from '@storybook/react'
import { RiskList } from './risk-list'

const meta = {
  title: 'Components/Projects/Sections/Risk List',
  component: RiskList,
} satisfies Meta<typeof RiskList>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
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
