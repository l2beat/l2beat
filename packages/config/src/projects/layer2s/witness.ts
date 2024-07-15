import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const witness: Layer2 = underReviewL2({
  id: 'witness',
  display: {
    name: 'Witness Chain',
    slug: 'witness',
    category: 'Validium',
    provider: 'Polygon',
    description:
      'Witness Chain is a Validium built on the Polygon CDK stack and Eigenlayer services. The purpose of the project is to create a DePIN coordination Layer.',
    purposes: ['IoT', 'Oracles'],
    links: {
      websites: ['https://witnesschain.com/'],
      apps: ['https://witnesschain-bridge.eu-north-2.gateway.fm'],
      documentation: ['https://docs.witnesschain.com/'],
      explorers: ['https://witnesschain-blockscout.eu-north-2.gateway.fm/'],
      repositories: ['https://github.com/witnesschain-com'],
      socialMedia: [
        'https://twitter.com/witnesschain',
        'https://discord.gg/HwnzU5CYDp',
        'https://docs.witnesschain.com/resources/technical-papers',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // rpcUrl: 'https://witnesschain-sequencer.eu-north-2.gateway.fm/',
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://witnesschain-sequencer.eu-north-2.gateway.fm/',
    defaultCallsPerMinute: 1500,
  },
  escrows: [], // shared
})
