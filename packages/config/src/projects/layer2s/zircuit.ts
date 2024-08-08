import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zircuit')

export const zircuit: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit is a universal Rollup that aims to use zk proofs in the future. It is based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    purposes: ['Universal'],
    links: {
      websites: ['https://zircuit.com/'],
      apps: ['https://bridge.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: [],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  genesisTimestamp: new UnixTime(1719936217),
  rpcUrl: 'https://zircuit1-mainnet.p2pify.com/', // other: https://zircuit1-mainnet.liquify.com, https://zircuit-mainnet.drpc.org/
  // Chain ID: 48900
  usesBlobs: true,
  isNodeAvailable: 'UnderReview',
  useDiscoveryMetaOnly: true,
  // proof system currently with temporary backdoor
  
  nonTemplateContracts: [    
    discovery.getContractDetails('Verifier', {
    description:
      "This contract verifies zk proof (if provided). There is a temporary backdoor allowing to call this contract without the proof",
    }), 
  ],
  milestones: [
    {
      name: 'Zircuit Mainnet Launch',
      link: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live', 
      date: '2024-08-05T00:00:00.00Z',
      description: 'Zircuit is live on mainnet.',
    },
  ],
})
