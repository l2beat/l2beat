import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const bitlazer: Layer3 = underReviewL3({
  id: 'bitlazer',
  capability: 'universal',
  addedAt: new UnixTime(1737636289), // 2025-01-21T14:24:03+00:00
  hostChain: ProjectId('arbitrum'),
  badges: [
    Badge.RaaS.Caldera,
    Badge.L3ParentChain.Arbitrum,
    Badge.DA.DAC,
    Badge.Stack.Orbit,
    Badge.VM.EVM,
  ],
  display: {
    name: 'Bitlazer',
    slug: 'bitlazer',
    category: 'Optimium',
    stack: 'Arbitrum',
    description:
      'Bitlazer is an Orbit stack L3 with AnyTrust DA powering BTC-focused DeFi applications and payments.',
    purposes: ['Bitcoin DApps'],
    links: {
      websites: ['https://bitlazer.io/'],
      apps: [
        'https://bitlazer.bridge.caldera.xyz/',
        'https://bitlazer.io/bridge',
      ],
      documentation: ['https://bitlazer.gitbook.io/bitlazer'],
      explorers: ['https://bitlazer.calderaexplorer.xyz/'],
      socialMedia: ['https://x.com/bitlazer', 'https://t.me/bitlazer_io'],
    },
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://bitlazer.calderachain.xyz/http',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x31623A545B431095C6F4552919FEe4fE7508Eb59'), // bridge (lzrBTC gastoken, not on CG)
      sinceTimestamp: new UnixTime(1734198985),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xa342a19e4029D7811317862d7E69DACB6d92181b'), // standardGW
      sinceTimestamp: new UnixTime(1734198995),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
