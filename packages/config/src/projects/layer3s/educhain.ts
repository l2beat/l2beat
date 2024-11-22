import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('educhain', 'arbitrum')

export const educhain: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
  discovery,
  badges: [Badge.DA.DAC, Badge.RaaS.Gelato],
  additionalPurposes: ['Social'],
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'EDU',
    slug: 'edu-chain',
    description:
      'EDU Chain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is designed to onboard real-world educational economies to blockchain and establish an innovative “Learn Own Earn” model for education.',
    links: {
      websites: ['https://opencampus.xyz/'],
      apps: ['https://bridge.gelato.network/bridge/edu-chain'],
      documentation: ['https://userdocs.opencampus.xyz/edu-chain/introduction'],
      explorers: ['https://educhain.blockscout.com/'],
      repositories: ['https://github.com/opencampus-xyz'],
      socialMedia: ['https://x.com/opencampus_xyz'],
    },
    activityDataSource: 'Blockchain RPC',
  },

  associatedTokens: ['EDU'],
  rpcUrl: 'https://rpc.edu-chain.raas.gelato.cloud',
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://medium.com/edu-chain', //TODO
      date: '2024-12-02T00:00:00Z',
      description: 'Educhain L3 opens its mainnet to all users.',
      type: 'general',
    },
  ],
})
