import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('ebichain')

export const ebichain: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1726563843), // 2024-09-17T09:04:03Z
  archivedAt: UnixTime(1743984000), // 2025-04-07T00:00:00.000Z,
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['Exchange'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Ebi Chain',
    slug: 'ebichain',
    headerWarning:
      'ebi.xyz DEX [is winding down](https://x.com/ebixyzdex/status/1861326984078598388).',
    description:
      'Ebi Chain is a Layer-2 hosting the Ebi.xyz platform, a limit order book decentralized platform for trading perpetual futures.',
    links: {
      websites: ['https://ebi.xyz/en/home/'],
      bridges: ['https://ebi.xyz/en/trade/contract/'],
      documentation: ['https://docs.ebi.xyz/ebi.xyz-overview'],
      explorers: ['https://explorer.ebi.xyz/'],
      socialMedia: [
        'https://x.com/ebixyzdex',
        'https://t.me/ebixyzofficial',
        'https://discord.com/invite/ebixyz',
      ],
    },
  },
  chainConfig: {
    name: 'ebichain',
    chainId: 98881,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.ebi.xyz',
        callsPerMinute: 300,
      },
    ],
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
