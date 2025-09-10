import { ChainSpecificAddress, EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'
import { orbitStackL2 } from '../../templates/orbitStack'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('powerloom')

export const powerloom: ScalingProject = orbitStackL2({
  discovery,
  capability: 'universal',
  addedAt: UnixTime(1741768931),
  display: {
    name: 'Powerloom',
    slug: 'powerloom',
    description:
      'Powerloom Mainnet is the Layer-2 chain supporting Powerloom’s composable data network where devs, orgs, and end-users get access to ready-to-consume, affordable, and verifiable onchain datasets.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://powerloom.io/'],
      bridges: ['https://bridge-v2.powerloom.network/'],
      documentation: ['https://docs.powerloom.io/'],
      explorers: ['https://explorer.powerloom.network/'],
      repositories: ['https://github.com/powerLoom'],
      socialMedia: [
        'https://x.com/powerloom',
        'https://t.me/PowerLoomProtocol',
        'https://linkedin.com/company/powerloom/',
        'https://youtube.com/@powerloom',
        'https://discord.com/invite/powerloom',
      ],
    },
  },
  additionalPurposes: ['Information'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  isNodeAvailable: 'UnderReview',
  associatedTokens: ['POWER'],
  chainConfig: {
    name: 'powerloom',
    gasTokens: ['POWER'],
    chainId: 7869,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-v2.powerloom.network',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress('eth:0x23593421341152D5322F8869c0638DAAc4aED57C'),
      name: 'L1OrbitUSDCGateway',
      sinceTimestamp: UnixTime(1741768931),
      tokens: ['POWER'],
    }),
  ],
})
