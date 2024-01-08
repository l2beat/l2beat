import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const fuel: Layer2 = upcoming({
  id: 'fuel',
  display: {
    name: 'Fuel',
    slug: 'fuel',
    description:
      'At Fuel we are building the fastest execution layer for the modular blockchain stack.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://fuel.network/'],
      apps: ['https://alpha.fuel.network/ecosystem/'],
      documentation: ['https://docs.fuel.network/'],
      explorers: ['https://fuellabs.github.io/block-explorer-v2/'],
      repositories: ['https://github.com/FuelLabs/'],
      socialMedia: [
        'https://twitter.com/fuel_network',
        'https://discord.com/invite/fuelnetwork',
        'https://forum.fuel.network/',
      ],
    },
  },
})
