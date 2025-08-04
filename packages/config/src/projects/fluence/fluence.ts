import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('fluence')

export const fluence: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1726790400), // 2024-09-20T00:00:00+00:00
  discovery,
  additionalBadges: [BADGES.RaaS.Gelato],
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
      websites: ['https://fluence.network/'],
      bridges: ['https://bridge.fluence.network/bridge/fluence'],
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
      address: ChainSpecificAddress(
        'eth:0x5d436201d1fD53Dc9ECeA4268f257C6fC87c598D',
      ),
      tokens: '*',
    }),
  ],
  associatedTokens: ['FLT'],
  chainConfig: {
    name: 'fluence',
    chainId: 9999999,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mainnet.fluence.dev',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['FLT'],
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://blog.fluence.network/welcome-to-fluence-staking-stake-shape-the-cloudless-future/',
      date: '2024-09-20T00:00:00Z',
      description: 'Fluence launches FLT staking on Layer 2.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
