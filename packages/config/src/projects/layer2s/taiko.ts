import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const taiko: Layer2 = underReviewL2({
  id: 'taiko',
  display: {
    name: 'Taiko',
    slug: 'taiko',
    description:
      'Taiko is an Ethereum-equivalent ZK Rollup on the Ethereum network. Taiko combines based sequencing and a contestation mechanism with multi-proofs.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://taiko.xyz'],
      apps: ['https://bridge.hekla.taiko.xyz/'],
      documentation: ['https://docs.taiko.xyz/'],
      explorers: ['https://hekla.taikoscan.network/'],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
      ],
      rollupCodes: 'https://rollup.codes/taiko',
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['TKO'],
  escrows: [
    {
      // ETH bridge
      address: EthereumAddress('0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC'),
      sinceTimestamp: new UnixTime(1714550603),
      tokens: ['ETH'],
    },
    {
      // ERC20 vault
      address: EthereumAddress('0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab'),
      sinceTimestamp: new UnixTime(1714550603),
      tokens: '*',
    },
  ],
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.mainnet.taiko.xyz',
    defaultCallsPerMinute: 500,
    startBlock: 1,
  },
  chainConfig: {
    name: 'taiko',
    chainId: 167000,
    explorerUrl: 'https://taikoscan.io',
    explorerApi: {
      url: 'https://taikoscan.io/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1716620627),
  },
})
