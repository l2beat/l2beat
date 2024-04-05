import { ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('degen', 'base')

export const degen: Layer3 = orbitStackL3({
  hostChain: ProjectId('base'),
  discovery,
  display: {
    name: 'Degen Chain',
    slug: 'degen',
    description:
      'Degen Chain is an ultra-low-cost L3 for the Degen community built with Arbitrum Orbit, Base for settlement, and AnyTrust for data availability. DEGEN is the native gas token.',
    purposes: ['Social', 'DeFi', 'Universal'],
    links: {
      websites: ['https://syndicate.io/blog/degen-chain'],
      apps: ['https://bridge.degen.tips/', 'https://degen.tips/'],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
      explorers: ['https://explorer.degen.tips/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/degentokenbase',
        'https://warpcast.com/~/channel/degen',
      ],
    },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
