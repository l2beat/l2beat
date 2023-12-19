import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStack } from './opstack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('lyra')

export const lyra: Layer2 = opStack({
  discovery,
  display: {
    name: 'Lyra',
    slug: 'lyra',
    description:
      'Lyra Chain is an L2 scaling solution built using OP Stack specially for Lyra protocol - a settlement protocol for spot, perpetuals, and options trading.',
    purpose: 'Exchange',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://lyra.finance/'],
      apps: ['https://lyra.finance/portfolio'],
      documentation: ['https://docs.lyra.finance/docs/introduction'],
      explorers: ['https://explorer.lyra.finance/'],
      repositories: ['https://github.com/lyra-finance/v2-core'],
      socialMedia: [
        'https://twitter.com/lyrafinance',
        'https://discord.gg/Lyra',
      ],
    },
  },
  l1StandardBridgeEscrow: EthereumAddress(
    '0x61E44dC0dae6888B5a301887732217d5725B0bFf',
  ),
  apiUrl: 'https://rpc.lyra.finance',
  sequencerAddress: EthereumAddress(
    discovery.getContractValue('SystemConfig', 'batcherHash'),
  ),
  inboxAddress: EthereumAddress('0x5f7f7f6DB967F0ef10BdA0678964DBA185d16c50'),
  genesisTimestamp: new UnixTime(1700022479),
  l2OutputOracle: discovery.getContract('L2OutputOracle'), // TODO: should be derived?
  portal: discovery.getContract('OptimismPortal'),
  // stateDerivation: DERIVATION.OPSTACK('LYRA'),
  milestones: [],
  knowledgeNuggets: []
})
