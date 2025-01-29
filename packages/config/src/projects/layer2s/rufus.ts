import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { underReviewL2 } from '../layer2s/templates/underReview'

export const rufus: Layer2 = underReviewL2({
  id: 'rufus',
  capability: 'universal',
  addedAt: new UnixTime(1737636288), // 2025-01-23T12:44:48+00:00
  badges: [Badge.RaaS.Caldera, Badge.DA.DAC, Badge.Stack.Orbit, Badge.VM.EVM],
  display: {
    name: 'Rufus',
    slug: 'rufus',
    category: 'Optimium',
    stack: 'Arbitrum',
    description:
      'Rufus is an Orbit stack L2 with AnyTrust DA created for gaming by the team behind the Dogelon (ELON) token.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://dogelonmars.com/'],
      apps: ['https://rufus.bridge.caldera.xyz/'],
      explorers: ['https://rufus.calderaexplorer.xyz/'],
      socialMedia: [
        'https://x.com/dogelonmars',
        'https://dogelonmars.com/blog',
        'https://t.me/DogelonMars',
        'https://discord.gg/dogelonmars',
        'https://reddit.com/r/dogelon/',
      ],
    },
  },
  associatedTokens: ['ELON'],
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rufus.calderachain.xyz/http',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x0E1a60c49b3aAABa3313918f63F6CC6c55746B17'), // bridge
      sinceTimestamp: new UnixTime(1733961947),
      tokens: ['ELON'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x7F6300B8d3be27aAe2c7b5f9B5dB95152279D926'), // standardGW
      sinceTimestamp: new UnixTime(1733961983),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
