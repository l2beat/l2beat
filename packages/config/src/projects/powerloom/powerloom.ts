import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('powerloom')

export const powerloom: ScalingProject = orbitStackL2({
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  additionalBadges: [BADGES.RaaS.Conduit],
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
      explorers: ['https://explorer-v2.powerloom.network'],
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
        callsPerMinute: 300,
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
      address: ChainSpecificAddress(
        'eth:0x23593421341152D5322F8869c0638DAAc4aED57C',
      ),
      name: 'L1OrbitUSDCGateway',
      sinceTimestamp: UnixTime(1741768931),
      tokens: ['USDC'],
    }),
  ],
})
