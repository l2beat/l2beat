import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('celo')

export const celo: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1718876598), // '2024-06-20T09:43:18Z'
  display: {
    name: 'Celo',
    slug: 'celo',
    description:
      'Celo is an Ethereum Optimium based on the OP stack, scaling real-world solutions & leading a thriving new digital economy for all.',
    category: 'Optimium',
    stack: 'OP Stack',
    links: {
      websites: ['https://celo.org/'],
      documentation: ['https://docs.celo.org/'],
      explorers: ['https://explorer.celo.org/mainnet/', 'https://celoscan.io'],
      repositories: ['https://github.com/celo-org'],
      socialMedia: [
        'https://x.com/Celo',
        'https://discord.com/invite/celo',
        'https://blog.celo.org/',
      ],
    },
  },
  nonTemplateOptimismPortalEscrowTokens: ['CELO'],
  chainConfig: {
    name: 'celo',
    chainId: 42220,
    explorerUrl: 'https://celoscan.io',
    coingeckoPlatform: 'celo',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 13112599,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://celo.chainvibes.nl',
        callsPerMinute: 4000,
      },
      {
        type: 'etherscan',
        url: 'https://api.celoscan.io/api',
        contractCreationUnsupported: true,
      },
    ],
  },
  isNodeAvailable: 'UnderReview',
  discovery,
  genesisTimestamp: UnixTime(1742960663), // ts of first batch posted, block 0 from the rpc: 1587571200
})
