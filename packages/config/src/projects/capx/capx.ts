import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('capx')

export const capx: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1692958606), // '2023-08-25T10:16:46Z'
  additionalBadges: [BADGES.RaaS.Caldera],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Capx',
    slug: 'capx',
    description:
      'Capx is an Orbit stack Optimium focused on simplifying and reducing the cost of building AI agents.',
    links: {
      websites: ['https://capx.ai/'],
      bridges: ['https://bridge.capx.fi/'],
      documentation: ['https://docs.capx.ai'],
      explorers: ['https://capxscan.com'],
      repositories: ['https://github.com/capx-ai'],
      socialMedia: [
        'https://discord.com/invite/capx',
        'https://x.com/0xCapx',
        'https://t.me/capxai',
      ],
    },
  },
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'capx',
    chainId: 757,
    explorerUrl: 'https://capxscan.com',
    sinceTimestamp: UnixTime(1758847391),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.capx.ai',
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['CAPX'],
  },
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
