import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const lightlink: Layer2 = upcoming({
  id: 'lightlink',
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is an Ethereum Layer 2 blockchain that lets dApps and enterprises offer users instant, gasless transactions.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
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
  },
})
