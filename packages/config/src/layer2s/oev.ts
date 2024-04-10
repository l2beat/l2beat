import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const oev: Layer2 = upcomingL2({
  id: 'oev',
  display: {
    name: 'OEV Network',
    slug: 'oev',
    description:
      'OEV is an upcoming Validium by API3, built with Polygon CDK. It is designed to capture oracle extractable value and return it to the dApps and their users that generated it.',
    purposes: ['Auctions'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://api3.org/'],
      apps: [
        'https://oev-network-sepolia-testnet-bridge.eu-north-2.gateway.fm',
      ],
      documentation: [
        'https://medium.com/api3/oracle-extractable-value-oev-13c1b6d53c5b',
      ],
      explorers: [
        'https://oev-network-sepolia-testnet-blockscout.eu-north-2.gateway.fm',
      ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/API3DAO',
        'https://discord.com/invite/api3dao',
      ],
    },
  },
})
