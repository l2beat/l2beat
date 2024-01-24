import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const chain: Layer2 = upcoming({
  id: 'chain',
  display: {
    name: 'Chain Network',
    slug: 'chain',
    description:
      'Zentachain is a privacy-focused IoT blockchain networking project that is focused on communication and data storage. Innovative and useful solutions are provided for issues of security and data ownership.',
    purposes: ['Universal', 'Privacy'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://zentachain.io/'],
      apps: ['https://sepolia-bridge.zentachain.io/'],
      documentation: ['https://docs.zentachain.io/'],
      explorers: ['https://explorer-sepolia.zentachain.io/'],
      repositories: ['https://github.com/ZentaChain'],
      socialMedia: [
        'https://twitter.com/zentachain',
        'https://discord.com/invite/TR5bv3e8Ny',
        'https://zentachain.blog/',
        'https://t.me/ZentachainOfficialChat',
        'https://www.reddit.com/r/Zentachain/',
      ],
    },
  },
})
