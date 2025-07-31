import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('apechain')

export const apechain: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1729296000), // 2024-10-19
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Caldera],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'ApeChain',
    slug: 'apechain',
    description:
      'ApeChain is an Optimium on Arbitrum, built on the Orbit stack. It is built to support the ApeCoin ecosystem. Powered by $APE as gas token it aims to host assets and games of the ApeCoin ecosystem with development and growth led by Horizen Labs.',
    links: {
      websites: ['https://apechain.com/'],
      bridges: ['https://apechain.com/portal'],
      documentation: ['https://docs.apechain.com/'],
      explorers: ['https://apescan.io/'],
      socialMedia: [
        'https://twitter.com/apecoin',
        'https://discord.gg/apecoindao',
        'https://t.me/apechainofficial',
      ],
    },
  },
  hostChain: 'arbitrum',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'apechain',
    chainId: 33139,
    coingeckoPlatform: 'apechain',
    sinceTimestamp: UnixTime(1724863522),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.apechain.com/http',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['APE'],
  },
  associatedTokens: ['APE'],
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/apecoin/status/1847731593437155673',
      date: '2024-10-19T00:00:00Z',
      description: 'ApeChain launches its Mainnet.',
      type: 'general',
    },
  ],
})
