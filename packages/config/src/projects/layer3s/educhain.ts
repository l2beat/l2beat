import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'

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
    description: 'EDU Chain is an upcoming Layer 3 on Arbitrum, built on the Orbit stack. It is designed to onboard real-world educational economies to blockchain and establish an innovative “Learn Own Earn” model for education.',
    links: {
      websites: ['https://opencampus.xyz/'],
      apps: [],
      documentation: ['https://userdocs.opencampus.xyz'],
      explorers: ['https://opencampus-codex.blockscout.com/'],
      repositories: ['https://github.com/opencampus-xyz'],
      socialMedia: ['https://x.com/opencampus_xyz'],
    },
  },
  
  associatedTokens: ['EDU'],
  rpcUrl: 'https://rpc.open-campus-codex.gelato.digital',
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Mainnet launch',
      link: '', //TODO
      date: '2024-01-01T00:00:00Z', //TODO
      description: 'Educhain L3 is open for all users.',
      type: 'general',
    },
  ],
})
