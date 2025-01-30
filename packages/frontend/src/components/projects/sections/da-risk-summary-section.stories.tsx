import type { Meta, StoryObj } from '@storybook/react'
import { DaRiskSummarySection } from './da-risk-summary-section'
import type { RiskGroup } from './risk-summary-section'

const meta = {
  title: 'Components/Projects/Sections/DA Risk Summary',
  component: DaRiskSummarySection,
  args: {
    id: 'risk-analysis',
    title: 'Risks summary',
    sectionOrder: '1',
    isVerified: true,
    redWarning: undefined,
    warning: undefined,
  },
} satisfies Meta<typeof DaRiskSummarySection>
export default meta

type Story = StoryObj<typeof meta>

const risks: RiskGroup[] = [
  {
    name: 'Funds can be stolen if',
    start: 1,
    items: [
      {
        text: "a dishonest supermajority of Celestia validators finalizes an unavailable block, and there aren't light nodes on the network verifying data availability, or they fail at social signaling unavailable data.",
        isCritical: true,
        referencedId: '',
      },
      {
        text: "a dishonest supermajority of Celestia validators finalizes an unavailable block, and there aren't light nodes on the network verifying data availability, or they fail at social signaling unavailable data.",
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
] as const

export const Default: Story = {
  args: {
    layer: {
      name: 'DA Layer',
      risks,
    },
    bridge: {
      name: 'Bridge',
      risks,
    },
  },
}
