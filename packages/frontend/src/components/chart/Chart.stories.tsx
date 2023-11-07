import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../../.storybook/modes'
import { configureCharts } from '../../scripts/charts'
import { Chart } from './Chart'

const meta: Meta<typeof Chart> = {
  component: Chart,
  args: {
    initialType: { type: 'storybook-fake-tvl' },
    milestones: [
      {
        name: 'First zkRollup (DEX)',
        date: '2019-12-04T00:00:00Z',
        link: 'https://medium.loopring.io/loopring-deployed-protocol-3-0-on-ethereum-a33103c9e5bf',
        description:
          'Loopring is live, bringing the first DEX protocol on zkRollup technology.',
      },
      {
        name: 'First StarkEx Validium',
        date: '2020-06-03T00:00:00Z',
        link: 'https://medium.com/starkware/starks-over-mainnet-b83e63db04c0',
        description:
          'DeversiFi is live, bringing first STARKex Validium for spot trading.',
      },
      {
        name: 'First zkRollup (for payments)',
        date: '2020-06-18T00:00:00Z',
        link: 'https://blog.matter-labs.io/zksync-is-live-bringing-trustless-scalable-payments-to-ethereum-9c634b3e6823',
        description:
          'zkSync 1.0 is live, bringing first zkRollup for payments.',
      },
      {
        name: 'Ethereum Rollup centric future',
        date: '2020-10-02T00:00:00Z',
        link: 'https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698',
        description:
          'Rollups are considered a scaling solution for the near and mid-term future of Ethereum.',
      },
      {
        name: 'First Optimistic Rollup (for payments)',
        date: '2020-12-31T00:00:00Z',
        link: 'https://twitter.com/fuellabs_/status/1344707195250896899',
        description:
          'Fuel v1 is live, bringing first trustless Optimistic Rollup for payments.',
      },
      {
        name: 'First Optimistic Rollup (universal)',
        link: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
        date: '2021-01-16T00:00:00Z',
        description:
          'Optimism is live, bringing first permissioned universal Optimistic Rollup with fraud proofs.',
      },
      {
        name: 'First private zkRollup (for payments)',
        link: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
        date: '2021-03-15T00:00:00Z',
        description:
          'Aztec is live, bringing first private zkRollup for payments.',
      },
      {
        name: 'First StarkEx Rollup (perpetuals)',
        date: '2021-04-06T00:00:00Z',
        link: 'https://dydx.exchange/blog/public',
        description:
          'dYdX is live, bringing first STARKex Rollup for perpetuals trading.',
      },
      {
        name: 'First public Optimistic Rollup (universal)',
        link: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
        date: '2021-08-31T00:00:00Z',
        description:
          'Arbitrum removed whitelist, becoming first publicly open universal Optimistic Rollup.',
      },
      {
        name: 'First STARK-based Rollup (universal)',
        link: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
        date: '2021-11-29T00:00:00Z',
        description:
          'Starknet Alpha is live, bringing first universal rollup based on zkRollup technology.',
      },
      {
        name: 'Hybrid Computation introduced',
        link: 'https://boba.network/turing-hybrid-compute/',
        date: '2022-03-05T00:00:00Z',
        description:
          'Hybrid Compute is live on Boba Network, bringing off-chain computation to smart contracts.',
      },
      {
        name: 'First Optimium (universal)',
        link: 'https://metisdao.medium.com/decentralized-storage-goes-live-da876dc6eb70',
        date: '2022-04-12T00:00:00Z',
        description:
          'Metis starts storing data off-chain, becoming first Optimium.',
      },
      {
        name: 'First Optimium with fallback (universal)',
        link: 'https://medium.com/offchainlabs/its-time-for-a-new-dawn-nova-is-open-to-the-public-a081df1e4ad2',
        date: '2022-08-09T00:00:00Z',
        description:
          'Arbitrum Nova is live, becoming first Optimium with fallback to Rollup mode.',
      },
      {
        name: 'First zkRollup with universal Solidity support',
        date: '2023-03-24T00:00:00Z',
        link: 'https://blog.matter-labs.io/gm-zkevm-171b12a26b36',
        description:
          'zkSync Era is now permissionless and open for everyone bringing first zkEVM to mainnet.',
      },
    ],
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        configureCharts({ disableLocalStorage: true })
      }, [])

      return <Story />
    },
  ],
}
export default meta
type Story = StoryObj<typeof Chart>

const tokens = [
  'DAI',
  'ETH',
  'COMP',
  'WBTC',
  'USDT',
  'USDC',
  'AAVE',
  'YFI',
  'UNI',
].map(
  (x) =>
    ({
      address: '0xabac',
      name: x,
      info: {
        type: 'EBV',
        assetId: '0xabac',
        chainId: 12,
        projectId: 'arbitrum',
        symbol: x,
      },
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    } as const),
)

export const Primary: Story = {}

export const EmptyState: Story = {
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const chart = document.querySelector<HTMLElement>('[data-role="chart"]')
    if (!chart) throw new Error('Chart not found')
    chart.dataset.state = 'empty'
    chart.dataset.interactivityDisabled = 'true'
  },
}

export const ErrorState: Story = {
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const chart = document.querySelector<HTMLElement>('[data-role="chart"]')
    if (!chart) throw new Error('Chart not found')
    chart.dataset.state = 'error'
    chart.dataset.interactivityDisabled = 'true'
  },
}

export const WithEth: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('ETH'))
  },
}

export const WithLogScale: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('LOG'))
  },
}

export const With7D: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('7D'))
  },
}

export const With30D: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('30D'))
  },
}

export const With90D: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('90D'))
  },
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
}

export const With180D: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('180D'))
  },
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
}

export const With1Y: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('1Y'))
  },
}

export const WithMax: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByDisplayValue('MAX'))
  },
}

export const TvlWithHeader: Story = {
  args: {
    withHeader: true,
  },
}

export const TvlWithTokens: Story = {
  args: {
    tokens,
  },
}

export const TvlWithActivity: Story = {
  args: {
    hasActivity: true,
  },
}

export const DetailedTvlWithActivity: Story = {
  args: {
    initialType: { type: 'storybook-fake-detailed-tvl' },
    hasActivity: true,
  },
}

export const DetailedTvlWithHeader: Story = {
  args: {
    initialType: { type: 'storybook-fake-detailed-tvl' },
    withHeader: true,
  },
}

export const DetailedTvlWithTokens: Story = {
  args: {
    initialType: { type: 'storybook-fake-detailed-tvl' },
    tokens,
  },
}

export const Activity: Story = {
  args: {
    initialType: { type: 'storybook-fake-activity' },
  },
}

export const ActivityWithoutEthTxs: Story = {
  args: {
    initialType: { type: 'storybook-fake-activity' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox =
      canvas.queryByText('ETH Mainnet Transactions') ??
      canvas.getByText('ETH Txs')
    await userEvent.click(checkbox)
  },
}

export const ActivityWithHeader: Story = {
  args: {
    initialType: { type: 'storybook-fake-activity' },
    withHeader: true,
  },
}

export const Upcoming: Story = {
  args: {
    isUpcoming: true,
  },
}
