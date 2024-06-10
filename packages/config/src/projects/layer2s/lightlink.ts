import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const lightlink: Layer2 = underReviewL2({
  id: 'lightlink',
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is an Ethereum Layer 2 blockchain that lets dApps and enterprises offer users instant, gasless transactions.',
    purposes: ['Universal'],
    category: 'Optimium',
    links: {
      websites: ['https://lightlink.io'],
      apps: ['https://phoenix.lightlink.io/apps'],
      documentation: ['https://docs.lightlink.io'],
      explorers: ['https://phoenix.lightlink.io'],
      repositories: ['https://github.com/lightlink-network'],
      socialMedia: [
        'https://twitter.com/lightlinkchain',
        'https://discord.com/invite/lightlinkchain',
        'https://t.me/lightlinkll',
        'https://linkedin.com/company/lightlinkchain',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['LL'],
  transactionApi: {
    type: 'rpc',
    startBlock: 1, // 1674578628
    defaultUrl: 'https://replicator.phoenix.lightlink.io/rpc/v1',
    defaultCallsPerMinute: 500,
  },
  chainConfig: {
    name: 'lightlink',
    chainId: 1890,
    explorerUrl: 'https://phoenix.lightlink.io',
    explorerApi: {
      url: 'https://phoenix.lightlink.io/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1692181067),
  },
  escrows: [
    {
      address: EthereumAddress('0x3ca373F5ecB92ac762f9876f6e773082A4589995'),
      sinceTimestamp: new UnixTime(1692181067),
      tokens: ['ETH'],
    },
    {
      address: EthereumAddress('0x63105ee97bfb22dfe23033b3b14a4f8fed121ee9'),
      sinceTimestamp: new UnixTime(1692185219),
      tokens: '*',
    },
  ],
})
