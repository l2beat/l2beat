import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types/bridge'

export const hyphenBridge: BridgeDescription = {
  name: 'Hyphen Bridge',
  slug: 'hyphenbridge',
  purpose: 'Swap Bridge',
  links: {
    websites: ['https://hyphen.biconomy.io/'],
  },
  //associatedTokens: ['BICO'], TODO: add BICO token
  bridges: [
    {
      address: '0x2A5c2568b10A0E826BfA892Cf21BA7218310180b',
      sinceTimestamp: new UnixTime(1647128990),
      tokens: ['ETH', 'USDC', 'USDT'],
    },
  ],
  connections: [],
}
