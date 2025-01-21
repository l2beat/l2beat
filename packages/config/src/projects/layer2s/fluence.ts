import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('fluence')

export const fluence: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1730898278), // 2024-11-06T13:04:38+00:00
  discovery,
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Gelato],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
      REASON_FOR_BEING_OTHER.SMALL_DAC,
    ],
    name: 'Fluence',
    slug: 'fluence',
    description:
      'Fluence is an Optimium on Ethereum, built on the Orbit stack. It enables a decentralized serverless platform & computing marketplace powered by blockchain economics.',
    links: {
      websites: ['https://luence.network/'],
      apps: ['https://bridge.fluence.network/bridge/fluence'],
      documentation: ['https://fluence.dev/docs/learn/overview'],
      explorers: ['https://blockscout.mainnet.fluence.dev/'],
      repositories: ['https://github.com/fluencelabs'],
      socialMedia: [
        'https://x.com/fluence_project',
        'https://discord.com/invite/5qSnPZKh7u',
        'https://t.me/fluence_project',
        'https://youtube.com/channel/UC3b5eFyKRFlEMwSJ1BTjpbw',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      //standardGateway
      address: EthereumAddress('0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D'),
      tokens: '*',
    }),
  ],
  gasTokens: ['FLT'],
  associatedTokens: ['FLT'],
  rpcUrl: 'https://rpc.mainnet.fluence.dev',
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://blog.fluence.network/welcome-to-fluence-staking-stake-shape-the-cloudless-future/',
      date: '2024-09-20T00:00:00Z',
      description: 'Fluence launches FLT staking on Layer 2.',
      type: 'general',
    },
  ],
})
