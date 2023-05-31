import { Milestone } from '../../common'

const MAINNET_OPEN = {
  name: 'Mainnet for everyone',
  description:
    'Whitelist got removed, there are no restrictions on who can transact with the network.',
}

export const MILESTONES = {
  MAINNET_OPEN,
}

export const HOMEPAGE_MILESTONES: Milestone[] = [
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
    description: 'zkSync 1.0 is live, bringing first zkRollup for payments.',
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
    description: 'Aztec is live, bringing first private zkRollup for payments.',
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
    name: 'First Optimistic Chain (universal)',
    link: 'https://metisdao.medium.com/decentralized-storage-goes-live-da876dc6eb70',
    date: '2022-04-12T00:00:00Z',
    description:
      'Metis starts storing data off-chain, becoming first optimistic chain.',
  },
  {
    name: 'First Optimistic Chain with fallback (universal)',
    link: 'https://medium.com/offchainlabs/its-time-for-a-new-dawn-nova-is-open-to-the-public-a081df1e4ad2',
    date: '2022-08-09T00:00:00Z',
    description:
      'Arbitrum Nova is live, becoming first Optimistic Chain with fallback to Rollup mode.',
  },
  {
    name: 'First zkRollup with universal Solidity support',
    date: '2023-03-24T00:00:00Z',
    link: 'https://blog.matter-labs.io/gm-zkevm-171b12a26b36',
    description:
      'zkSync Era is now permissionless and open for everyone brining first zkEVM to mainnet.',
  },
]
