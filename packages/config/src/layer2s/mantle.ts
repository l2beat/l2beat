import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const mantle: Layer2 = underReviewL2({
  id: 'mantle',
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is an under development EVM compatible Optimium, based on the Optimism OVM architecture.',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'OVM',
    links: {
      websites: ['https://mantle.xyz/'],
      apps: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/', 'https://mantlescan.info'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  escrows: [
    {
      address: EthereumAddress('0x859a53Fe2C8DA961387030E7CB498D6D20d0B2DB'),
      sinceTimestamp: new UnixTime(1702607855),
      tokens: '*',
    },
    {
      address: EthereumAddress('0x0f1b7bd7762662B23486320AA91F30312184f70C'),
      sinceTimestamp: new UnixTime(1710273600),
      tokens: '*',
    },
    {
      address: EthereumAddress('0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb'),
      sinceTimestamp: new UnixTime(1710396767),
      tokens: ['MNT'],
    },
  ],
})
