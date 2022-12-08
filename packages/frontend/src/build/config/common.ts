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
      name: 'Rollup centric roadmap for Ethereum',
      date: '2020-10-02T00:00:00Z',
      link: 'https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698',
    },
    {
      name: 'Optimism launch',
      link: 'https://medium.com/ethereum-optimism/all-gas-no-brakes-8b0f32afd466',
      date: '2021-12-16T00:00:00Z',
    },
    {
      name: 'Arbitrum launch',
      link: 'https://twitter.com/arbitrum/status/1432817424752128008',
      date: '2021-08-31T00:00:00Z',
    },
    {
      name: 'zkEMV day on ETHcc',
      link: 'https://twitter.com/sandeepnailwal/status/1549868882638389248',
      date: '2022-07-20T00:00:00Z',
    },
    {
      name: 'Aave on Optimism',
      link: 'https://governance.aave.com/t/launch-aave-v3-on-optimism/6871',
      date: '2022-01-11T00:00:00Z'
    }
    
  ],
}
