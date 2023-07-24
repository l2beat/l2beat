import {  ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'



export const gnosispay: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('gnosis-pay'),
  display: {
    name: 'Gnosis Pay',
    slug: 'gnosis-pay',
    description:
      'Gnosis Pay is the first Decentralized Payment Network (DPN), removing the barriers between traditional finance and decentralized finance (DeFi).',
      purpose: 'Payments',
      category: 'Validium',
      links: {
        websites: ['https://polygon.technology/polygon-miden'],
        apps: [''],
        documentation: ['https://0xpolygonmiden.github.io/miden-base/introduction.html'],
        explorers: [
          ''
        ],
        repositories: ['https://github.com/0xPolygonMiden'],
        socialMedia: [
          'https://twitter.com/0xPolygonLabs',
          'https://discord.com/invite/0xPolygon',
          'https://t.me/polygonofficial']
    },
  },
  config: {
    escrows: [      
    ],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
