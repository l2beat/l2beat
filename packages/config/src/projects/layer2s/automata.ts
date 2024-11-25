import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('automata')

export const automata: Layer2 = opStackL2({
  createdAt: new UnixTime(1729359609), // 2024-10-19T17:40:09Z
  display: {
    name: 'Automata',
    slug: 'automata',
    description:
      'Automata Network is a modular attestation layer that extends machine-level trust to Ethereum with TEE Coprocessors.',
    links: {
      websites: ['https://ata.network/'],
      apps: ['https://bridge-testnet.ata.network/'],
      documentation: ['https://docs.ata.network/'],
      explorers: ['https://testnet-explorer.ata.network'],
      repositories: ['https://github.com/automata-network/automata'],
      socialMedia: [
        'https://x.com/AutomataNetwork',
        'https://discord.com/invite/automata',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  isNodeAvailable: 'UnderReview',
  rpcUrl: 'https://rpc.ata.network/',
  discovery,
  genesisTimestamp: new UnixTime(1721183063),
})
