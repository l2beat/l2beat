import { ProjectId } from '@l2beat/shared-pure'

import { Layer3 } from './types'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('popapex', 'arbitrum')

export const popapex: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  display: {
    name: 'Proof of Play Apex',
    shortName: 'Apex',
    slug: 'popapex',
    description:
      'Proof of Play Apex is a gaming-focused L3 settling on Arbitrum using Conduit and the AnyTrust Orbit stack flavour.',
    purposes: ['Gaming', 'NFT'],
    links: {
      websites: ['https://proofofplay.gg'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=pop-apex&sourceChain=arbitrum-one',
        'https://piratenation.game/',
      ],
      documentation: [],
      explorers: ['https://explorer.apex.proofofplay.com'],
      repositories: ['https://github.com/proofofplay'],
      socialMedia: [
        'https://twitter.com/ProofOfPlay/',
        'https://discord.com/invite/piratenation',
        'https://piratenation.medium.com/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.apex.proofofplay.com' // chainid 70700
})
