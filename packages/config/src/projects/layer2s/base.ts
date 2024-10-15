import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'
const discovery = new ProjectDiscovery('base')

export const base: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Base',
    slug: 'base',

    description:
      'Base is an Optimistic Rollup built with the OP Stack. It offers a low-cost and builder-friendly way for anyone, anywhere, to build onchain.',
    purposes: ['Universal'],
    links: {
      websites: ['https://base.org/'],
      apps: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: [
        'https://basescan.org/',
        'https://base.superscan.network',
        'https://base.blockscout.com/',
        'https://base.l2scan.co/',
      ],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
      ],
      rollupCodes: 'https://rollup.codes/base',
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://developer-access-mainnet.base.org',
  finality: {
    type: 'OPStack-blob',
    minTimestamp: new UnixTime(1710375515),
    genesisTimestamp: new UnixTime(1686789347),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp: new UnixTime(1686796655),
  stateDerivation: DERIVATION.OPSTACK('BASE'),
  isNodeAvailable: true,
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Chain stall',
      link: 'https://status.base.org/incidents/n3q0q4z24b7h',
      date: '2023-09-05T00:00:00Z',
      description:
        'Due to an RPC issue, the sequencer stops producing blocks for ~30 minutes.',
      type: 'incident',
    },
    {
      name: 'Base starts using blobs',
      link: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Base starts publishing data to blobs.',
      type: 'general',
    },
    {
      name: 'Base Mainnet Launch',
      link: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
      type: 'general',
    },
  ],
  badges: [Badge.Infra.Superchain, Badge.Other.L3HostChain],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x9de443AdC5A411E83F1878Ef24C3F52C61571e72'),
      tokens: ['wstETH'],
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
  chainConfig: {
    name: 'base',
    blockscoutV2ApiUrl: 'https://base.blockscout.com/api/v2',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
    explorerApi: {
      url: 'https://api.basescan.org/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Base
    // https://basescan.org/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-06-15T12:35:47Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'base',
  },
  usesBlobs: true,
})
