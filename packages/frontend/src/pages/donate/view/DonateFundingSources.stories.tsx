import { Meta, StoryObj } from '@storybook/react'

import { DonateFundingSources } from './DonateFundingSources'

const meta: Meta<typeof DonateFundingSources> = {
  component: DonateFundingSources,
}
export default meta
type Story = StoryObj<typeof DonateFundingSources>

export const Primary: Story = {
  args: {
    items: [
      {
        source: 'Ethereum Foundation',
        tier: 'Significant',
        description: 'Different grants in years 2021-2023',
      },
      {
        source: 'Optimism RPGF2',
        tier: 'Medium',
        description: 'March 2023',
      },
      {
        source:
          'Rewards & compensation for participating in L2 governance frameworks',
        tier: 'Medium',
        description:
          'We are participating in the governance of Arbitrum, Optimism, Hop, Polygon, Uniswap and Connext',
      },
      {
        source: 'Gitcoin',
        tier: 'Medium',
        description: 'Gitcoin rounds in 2022-2023',
      },
      {
        source: 'Direct community donations',
        tier: 'Small',
        description: 'Via this page',
      },
      {
        source: 'L2 Amsterdam (2022) conference sponsorships',
        tier: 'Small',
        description: 'April 2022; covered the costs of the conference',
      },
      {
        source: 'L2 Warsaw (2023) conference sponsorships',
        tier: 'Small',
        description: 'August 2023; covered the costs of the conference',
      },
      {
        source: 'L2DAYS Istanbul (2023) conference sponsorships',
        tier: 'Medium',
        description: 'November 2023; covered the costs of the conference',
      },
      {
        source: 'Upgradeability of Ethereum L2s” report',
        tier: 'Small',
        description: 'Funded by Polygon Labs',
      },
      {
        source: 'Open-source explorer for StarkEx deployments',
        tier: 'Medium',
        description:
          'Live at dydx.l2beat.com, view the code here. Funded by StarkWare and dYdX',
      },
      {
        source: 'LayerZero transparency dashboard',
        tier: 'Medium',
        description: 'Project in progress. Funded by LayerZero',
      },
      {
        source: 'DAC memberships',
        tier: 'Small',
        description: 'Discontinued',
      },
    ],
  },
}
