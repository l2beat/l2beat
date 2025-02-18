import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('fluence')

export const fluence: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1730898278), // 2024-11-06T13:04:38+00:00
  discovery,
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Gelato],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
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
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://blog.fluence.network/welcome-to-fluence-staking-stake-shape-the-cloudless-future/',
      date: '2024-09-20T00:00:00Z',
      description: 'Fluence launches FLT staking on Layer 2.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
