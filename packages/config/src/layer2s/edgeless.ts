import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const edgeless: Layer2 = underReviewL2({
  id: 'edgeless',
  display: {
    name: 'Edgeless',
    slug: 'edgeless',
    category: 'Optimium',
    provider: 'Arbitrum',
    description:
      // edgeless is posting limited data hashes to ethereum (0x88 sequencerVersion), planning to use EigenDA. Currently there is no DA.
      'Edgeless is an Orbit stack general-purpose Optimium without application layer fees.',
    purposes: ['Universal'],
    links: {
      websites: ['https://edgeless.network/'],
      apps: ['https://bridge.edgeless.network/'],
      documentation: ['https://docs.edgeless.network/'],
      explorers: ['https://explorer.edgeless.network/'],
      repositories: ['https://github.com/edgelessNetwork'],
      socialMedia: [
        'https://twitter.com/EdgelessNetwork',
        'https://discord.gg/edgeless',
        'https://paragraph.xyz/@edgeless',
        'https://t.me/+f8yhoOg-4cNhYWEx',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // rpcUrl: 'https://rpc.edgeless.network/http',
  escrows: [
    // this is not the bridge escrow itself but the strategy contract that holds all funds backing the ewETH in the canonical bridge escrow. The normal escrow can be used as soon as we track the ewETH token
    {
      address: EthereumAddress('0xbD95aa0f68B95e6C01d02F1a36D8fde29C6C8e7b'),
      sinceTimestamp: new UnixTime(1711057199),
      tokens: '*',
    },
  ],
})
