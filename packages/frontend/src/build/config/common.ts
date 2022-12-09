import { bridges, layer2s, tokenList } from '@l2beat/config'

import { Config } from './Config'

export const common: Omit<Config, 'backend'> = {
  links: {
    twitter: 'https://twitter.com/l2beat',
    discord: 'https://discord.gg/eaVKXPmtWk',
    github: 'https://github.com/l2beat/l2beat',
    youTube: 'https://www.youtube.com/channel/UCDrl-fNXFjOoykr4lQij9BA/videos',
    medium: 'https://medium.com/l2beat',
    forum: 'https://gov.l2beat.com/',
  },
  features: {
    banner: false,
    gitcoinOption: false,
    bridges: true,
    activity: true,
    milestones: false,
  },
  layer2s,
  bridges,
  tokens: tokenList,
  milestones: [
    {
      name: 'ZK rollup (payments)',
      date: '2020-06-18T00:00:00Z',
      link: 'https://blog.matter-labs.io/zksync-is-live-bringing-trustless-scalable-payments-to-ethereum-9c634b3e6823',
    },
    {
      name: 'Rollup centric vision for Ethereum',
      date: '2020-10-02T00:00:00Z',
      link: 'https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698',
    },
    {
      name: 'Optimistic Rollup (payments)',
      date: '2020-12-31T00:00:00Z',
      link: 'https://twitter.com/fuellabs_/status/1344707195250896899',
    },
    {
      name: 'Optimistic Rollup (universal)',
      link: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
      date: '2021-01-16T00:00:00Z',
    },
    {
      name: 'ZK Rollup (privacy)',
      link: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
      date: '2021-03-15T00:00:00Z',
    },
    {
      name: 'Public Optimistic Rollup (universal)',
      link: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
      date: '2021-08-31T00:00:00Z',
    },
    {
      name: 'ZK Rollup (universal)',
      link: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
      date: '2021-11-29T00:00:00Z',
    },
    {
      name: 'Optimistic Chain (universal)',
      link: 'https://metisdao.medium.com/decentralized-storage-goes-live-da876dc6eb70',
      date: '2022-04-12T00:00:00Z',
    },
  ],
}
