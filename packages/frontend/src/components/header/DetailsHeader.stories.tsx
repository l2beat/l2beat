import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { formatLargeNumber } from '../../utils'
import { TypeCell } from '../table/TypeCell'
import { DetailsHeader as DetailsHeaderComponent } from './DetailsHeader'
import { StatWithChange } from './stats/StatWithChange'

const meta: Meta<typeof DetailsHeaderComponent> = {
  component: DetailsHeaderComponent,
  args: {
    title: 'Arbitrum One',
    description:
      'Arbitrum One is a general-purpose Optimistic Rollup built by Offchain Labs and governed by the Arbitrum DAO.',
    icon: `/icons/arbitrum.png`,
    stats: {
      summary: [
        {
          title: 'Total value locked',
          value: (
            <StatWithChange
              className="font-bold"
              stat="$331.31M"
              change="+2.25%"
            />
          ),
        },
        {
          title: 'Daily TPS',
          value: <StatWithChange stat="2.21" change="-10.23%" />,
        },
        {
          title: '30D tx count',
          value: formatLargeNumber(800321),
        },
        {
          title: 'Purpose',
          value: ['Universal'],
        },
        {
          title: 'Type',
          value: <TypeCell>Optimistic Rollup</TypeCell>,
        },
      ],
      l2Tvl: {
        canonical: 1000,
        external: 2000,
        native: 3000,
        tvl: 6000,
        tvlChange: '+11%',
      },
    },
    links: [
      { name: 'Website', links: ['https://bridge.gnosischain.com/'] },
      { name: 'App', links: ['https://bridge.gnosischain.com/'] },
      {
        name: 'Docs',
        links: ['https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge'],
      },
      {
        name: 'Explorer',
        links: [
          'https://blockscout.com/xdai/mainnet',
          'https://gnosisscan.io/',
          'https://explorer.anyblock.tools/ethereum/poa/xdai/',
          'https://beacon.gnosischain.com/',
          'https://xdai.tokenview.io/',
        ],
      },
      { name: 'Repository', links: ['https://github.com/gnosischain'] },
      {
        name: 'Social',
        links: [
          'https://twitter.com/gnosischain',
          'https://discord.gg/VQb3WzsywU',
          'https://t.me/gnosischain',
        ],
      },
      {
        name: 'rollup.codes',
        links: ['https://rollup.codes/arbitrum-one'],
      },
    ],
    type: 'layer2',
  },
}
export default meta
type Story = StoryObj<typeof DetailsHeaderComponent>

export const Primary: Story = {}

export const Warning: Story = {
  args: {
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
  },
}

export const Archived: Story = {
  args: {
    isArchived: true,
  },
}

export const Upcoming: Story = {
  args: {
    isUpcoming: true,
  },
}

export const UnderReview: Story = {
  args: {
    showProjectUnderReview: true,
  },
}

export const ImplementationChanged: Story = {
  args: {
    implementationHasChanged: true,
  },
}
