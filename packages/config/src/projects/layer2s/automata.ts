import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const automata: Layer2 = upcomingL2({
  id: 'automata',
  createdAt: new UnixTime(1729359609), // 2024-10-19T17:40:09Z
  display: {
    name: 'Automata',
    slug: 'automata',
    description:
      'Automata Network is a modular attestation layer that extends machine-level trust to Ethereum with TEE Coprocessors.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://ata.network/'],
      apps: ['https://bridge-testnet.ata.network/'],
      documentation: ['https://docs.ata.network/'],
      explorers: ['https://testnet-explorer.ata.network/'],
      repositories: ['https://github.com/automata-network/automata'],
      socialMedia: [
        'https://x.com/AutomataNetwork',
        'https://discord.com/invite/automata',
      ],
    },
  },
})
