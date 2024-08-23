import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('optopia')

export const optopia: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Optopia',
    slug: 'optopia',
    description:
      'Optopia is an OP stack Rollup on Ethereum focusing on the intersection of AI, Intents and DeFi.',
    purposes: ['Universal', 'AI'],
    links: {
      websites: ['https://optopia.ai/'],
      apps: ['https://bridge.optopia.ai/'],
      documentation: ['https://docs.optopia.ai/', 'https://stack.optimism.io/'],
      explorers: ['https://scan.optopia.ai/'],
      repositories: ['https://github.com/OptopiaLabs'],
      socialMedia: [
        'https://x.com/Optopia_AI',
        'https://discord.com/invite/BFr9hXPDY6',
        'https://mirror.xyz/0x384F32e132501C9C3361C0495841715585164d33',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['OPAI'],
  genesisTimestamp: new UnixTime(1715333977),
  // failing, needs different analyzer?
  // finality: {
  //   type: 'OPStack-blob',
  //   genesisTimestamp: new UnixTime(1715333977),
  //   minTimestamp: new UnixTime(1715336651), // first blob
  //   l2BlockTimeSeconds: 2,
  //   lag: 0,
  //   stateUpdate: 'disabled',
  // },
  usesBlobs: true,
  isNodeAvailable: true,
  rpcUrl: 'https://rpc-mainnet-2.optopia.ai', // chainId: 62050
  useDiscoveryMetaOnly: true,
  milestones: [
    {
      name: 'Optopia Mainnet Launch',
      link: 'https://mirror.xyz/0x384F32e132501C9C3361C0495841715585164d33/t66jmeXb8sKTFoxFViXUeCQdhSZ_8CN12i13-ySNAUs',
      date: '2024-05-21T00:00:00.00Z',
      description: 'Optopia is live on mainnet.',
    },
  ],
})
