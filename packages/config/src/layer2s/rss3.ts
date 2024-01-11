import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const rss3: Layer2 = upcoming({
  id: 'rss3',
  display: {
    name: 'RSS3 Value Sublayer',
    slug: 'rss3',
    description:
      'The RSS3 Value Sublayer (VSL) as part of the RSS3 Network, is an Ethereum Layer2 built with OP Stack and Celestia DA, handling the value and ownership of AI and Open Information.',
    purpose: 'AI, Information',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://rss3.io'],
      apps: [],
      documentation: ['https://docs.rss3.io'],
      explorers: ['https://scan.testnet.rss3.io'],
      repositories: ['https://github.com/rss3-network'],
      socialMedia: [
        'https://twitter.com/rss3_',
        'https://discord.com/invite/rss3-network',
        'https://t.me/rss3_en'],
    },
  },
})
