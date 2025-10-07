import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ESPRESSO } from '../../common/sequencing'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('appchain')

export const appchain: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1744635768), // 2025-04-14T14:42:48Z
  capability: 'universal',
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  additionalBadges: [BADGES.RaaS.Caldera],
  display: {
    name: 'Appchain',
    slug: 'appchain',
    description:
      'AppChain is an incentivized Layer 2 that allows developers to capture the value their dApps create, enabling sustainable economic models.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://appchain.xyz/'],
      documentation: ['https://docs.appchain.xyz/'],
      explorers: ['https://explorer.appchain.xyz/'],
      bridges: ['https://bridge.appchain.xyz/'],
      socialMedia: [
        'https://x.com/onappchain',
        'https://warpcast.com/onappchain',
        'https://discord.com/invite/kntTtZXM4M',
      ],
    },
  },
  nonTemplateTechnology: {
    sequencing: ESPRESSO,
  },
  chainConfig: {
    name: 'appchain',
    chainId: 466,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.appchain.xyz/http',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
