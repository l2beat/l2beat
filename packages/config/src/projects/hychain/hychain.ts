import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('hychain')

export const hychain: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1709942400), // 2024-03-09T00:00:00Z
  archivedAt: UnixTime(1761826453), // 2025-10-30T12:14:13Z
  additionalBadges: [BADGES.RaaS.Caldera],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'HYCHAIN',
    slug: 'hychain',
    description:
      'HYCHAIN is a gaming-focused Orbit stack Optimium that was created to eliminate onboarding and technical challenges for web3 games aiming for widespread adoption.',
    links: {
      websites: ['https://hychain.com'],
      bridges: ['https://bridge.hychain.com'],
      documentation: ['https://docs.hychain.com'],
      explorers: ['https://explorer.hychain.com'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://x.com/HYCHAIN_GAMES',
        'https://discord.gg/hytopiagg',
        'https://hychain.substack.com/',
      ],
    },
  },
  discovery,
  associatedTokens: ['TOPIA'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'hychain',
    chainId: 2911,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.hychain.com/http',
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['TOPIA'],
  },
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/WINRProtocol/status/1867223130684735514',
      date: '2024-03-09T00:00:00Z',
      description: 'HYCHAIN launches its Mainnet.',
      type: 'general',
    },
  ],
})
