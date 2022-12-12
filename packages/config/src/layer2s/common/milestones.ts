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
    name: 'ZK rollup (payments)',
    date: '2020-06-18T00:00:00Z',
    link: 'https://blog.matter-labs.io/zksync-is-live-bringing-trustless-scalable-payments-to-ethereum-9c634b3e6823',
    description:
      'zkSync is live, bringing scalable payments using ZK Rollup technology.',
  },
  {
    name: 'Rollup centric vision for Ethereum',
    date: '2020-10-02T00:00:00Z',
    link: 'https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698',
    description:
      'Rollups are considered a scaling solution for the near and mid-term future of Ethereum.',
  },
  {
    name: 'Optimistic Rollup (payments)',
    date: '2020-12-31T00:00:00Z',
    link: 'https://twitter.com/fuellabs_/status/1344707195250896899',
    description:
      'Fuel v1 is live, bringing payments scalability using Optimistic Rollup technology and UTXO model.',
  },
  {
    name: 'Optimistic Rollup (universal)',
    link: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
    date: '2021-01-16T00:00:00Z',
    description:
      'Optimism soft launch is live, bringing first universal rollup based on optimistic architecture.',
  },
  {
    name: 'ZK Rollup (anonymous payments)',
    link: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
    date: '2021-03-15T00:00:00Z',
    description:
      'Aztec is live, bringing private and scalable transactions using ZK Rollup technology.',
  },
  {
    name: 'Public Optimistic Rollup (universal)',
    link: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
    date: '2021-08-31T00:00:00Z',
    description:
      'Arbitrum removed whitelist, becoming first publicly open universal rollup based on optimistic architecture.',
  },
  {
    name: 'ZK Rollup (universal)',
    link: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
    date: '2021-11-29T00:00:00Z',
    description:
      'StarkNet Alpha is live, bringing first universal rollup based on ZK technology.',
  },
  {
    name: 'Optimistic Chain (universal)',
    link: 'https://metisdao.medium.com/decentralized-storage-goes-live-da876dc6eb70',
    date: '2022-04-12T00:00:00Z',
    description:
      'Metis start storing data off-chain, becoming first optimistic chain.',
  },
]
