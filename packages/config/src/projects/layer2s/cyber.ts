import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const cyberconnect: Layer2 = upcomingL2({
  id: 'cyberconnect',
  display: {
    name: 'Cyber',
    slug: 'cyberconnect',
    description:
      'Cyber is an Ethereum layer 2 designed for social applications, based on the OP stack and utilizing EigenDA for data availability.',
    purposes: ['Universal', 'Social'],
    category: 'Optimium',
    provider: 'OP Stack',
    links: {
      websites: ['https://cyber.co/'],
      apps: ['https://cyber.co/stake'],
      documentation: ['https://docs.cyber.co/'],
      explorers: ['https://testnet.cyberscan.co/'],
      repositories: ['https://github.com/cyberconnecthq'],
      socialMedia: [
        'https://twitter.com/cyberconnecthq',
        'https://discord.com/invite/cUc8VRGmPs',
      ],
    },
  },
})
