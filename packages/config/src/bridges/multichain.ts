import { ProjectId, UnixTime } from '@l2beat/types'

import { RISK_VIEW } from './common'
import * as config from './multichain-config.json'
import { Bridge } from './types'

export const multichain: Bridge = {
  type: 'bridge',
  id: ProjectId('multichain'),
  display: {
    name: 'Multichain',
    slug: 'multichain',
    description:
      'Multichain is an externally validated bridge. It uses a network of nodes running SMPC (Secure Multi Party Computation) protocol. It supports dozens of blockchains and thousands of tokens with both Token Bridge and Liquidity Network.',
    links: {
      websites: ['https://multichain.xyz/'],
    },
  },
  config: {
    escrows: config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: new UnixTime(escrow.sinceTimestamp),
      tokens: escrow.tokens,
    })),
  },
  technology: {
    category: 'Hybrid',
    destination: config.destinations,
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '2/3rd of MPC.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'No / EOA',
      description:
        'Depending on the router configuration escrow contracts are EOAs or Any tokens which cannot be upgraded.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Depending on the router configuration either Multichain tokens or Any tokens are minted.',
    },
  },
}
