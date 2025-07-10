import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const bitlazer: ScalingProject = underReviewL3({
  id: 'bitlazer',
  capability: 'universal',
  addedAt: UnixTime(1737636289), // 2025-01-21T14:24:03+00:00
  hostChain: ProjectId('arbitrum'),
  badges: [
    BADGES.RaaS.Caldera,
    BADGES.L3ParentChain.Arbitrum,
    BADGES.DA.DAC,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'Bitlazer',
    slug: 'bitlazer',
    category: 'Optimium',
    stacks: ['Arbitrum'],
    description:
      'Bitlazer is an Orbit stack L3 with AnyTrust DA powering BTC-focused DeFi applications and payments.',
    purposes: ['Bitcoin DApps'],
    links: {
      websites: ['https://bitlazer.io/'],
      bridges: [
        'https://bitlazer.bridge.caldera.xyz/',
        'https://bitlazer.io/bridge',
      ],
      documentation: ['https://bitlazer.gitbook.io/bitlazer'],
      explorers: ['https://bitlazer.calderaexplorer.xyz/'],
      socialMedia: ['https://x.com/bitlazer', 'https://t.me/bitlazer_io'],
    },
  },
  chainConfig: {
    name: 'bitlazer',
    gasTokens: ['lzrBTC'],
    chainId: 14235,
    apis: [
      {
        type: 'rpc',
        url: 'https://bitlazer.calderachain.xyz/http',
        callsPerMinute: 1500,
      },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x31623A545B431095C6F4552919FEe4fE7508Eb59'), // bridge (lzrBTC gastoken, not on CG)
      sinceTimestamp: UnixTime(1734198985),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xa342a19e4029D7811317862d7E69DACB6d92181b'), // standardGW
      sinceTimestamp: UnixTime(1734198995),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
