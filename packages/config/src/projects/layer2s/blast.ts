import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { EXITS } from '../../common'
import { ESCROW } from '../../common/escrow'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('blast')

export const blast: Layer2 = opStackL2({
  createdAt: new UnixTime(1700555008), // 2023-11-21T08:23:28Z
  discovery,
  display: {
    name: 'Blast',
    slug: 'blast',
    architectureImage: 'blast',
    description:
      'Blast is an EVM-compatible Optimistic Rollup supporting native yield. It invests funds deposited into the L1 bridge into various DeFi protocols transferring yield back to the L2.',
    links: {
      websites: ['https://blast.io/en'],
      apps: ['https://blast.io/en/bridge'],
      documentation: ['https://docs.blast.io/about-blast'],
      explorers: ['https://blastscan.io', 'https://blastexplorer.io'],
      repositories: ['https://github.com/blast-io'],
      socialMedia: ['https://twitter.com/blast', 'https://discord.gg/blast-l2'],
    },
    activityDataSource: 'Blockchain RPC',
    tvlWarning: {
      content: 'The TVL does account for rehypothecated tokens.',
      sentiment: 'bad',
    },
  },
  nonTemplateTechnology: {
    exitMechanisms: [
      {
        ...EXITS.REGULAR_YIELDING(
          'optimistic',
          discovery.getContractValue<number>(
            'L2OutputOracle',
            'FINALIZATION_PERIOD_SECONDS',
          ),
        ),
        references: [
          {
            text: 'OptimismPortal.sol - Etherscan source code, proveWithdrawalTransaction function',
            href: `https://etherscan.io/address/0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391#code`,
          },
          {
            text: 'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
            href: `https://etherscan.io/address/0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391#code`,
          },
          {
            text: 'L2OutputOracle.sol - Etherscan source code, PROPOSER check',
            href: `https://etherscan.io/address/0x1C90963D451316E3DBFdD5A30354EE56C29016EB#code`,
          },
        ],
        risks: [EXITS.RISK_REHYPOTHECATED_ASSETS, EXITS.RISK_LACK_OF_LIQUIDITY],
      },
      {
        ...EXITS.FORCED('all-withdrawals'),
        references: [
          {
            text: 'Forced withdrawal from an OP Stack blockchain',
            href: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
          },
        ],
      },
    ],
  },
  rpcUrl: 'https://rpc.blast.io/',
  chainConfig: {
    name: 'blast',
    coingeckoPlatform: 'blast',
    chainId: 81457,
    explorerUrl: 'https://blastscan.io/',
    explorerApi: {
      url: 'https://api.blastscan.io/api',
      type: 'etherscan',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-02-24T21:23:35Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 88189,
        version: '3',
      },
    ],
  },
  finality: {
    type: 'OPStack-blob',
    // timestamp of the first blob tx
    minTimestamp: new UnixTime(1716846455),
    l2BlockTimeSeconds: 2,
    genesisTimestamp: new UnixTime(1708809815),
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp: new UnixTime(1708825259), //First sequencer transaction
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d'),
      name: 'Pre-launch Blast Vault',
      description:
        'Pre-launch Blast Vault that keeps stETH. Funds from this Vault can be migrated to Blast bridge.',
      tokens: ['stETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x98078db053902644191f93988341E31289E1C8FE'),
      name: 'Interest-bearing ETH Vault',
      tokens: ['ETH', 'stETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Escrow for ETH that is invested into a yield-bearing contracts such as stETH.',
    }),
  ],
  isNodeAvailable: true,
  associatedTokens: ['BLAST'],
  nodeSourceLink: 'https://github.com/blast-io/blast',
  discoveryDrivenData: true,
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/blast-io/blast).',
    compressionScheme:
      'Data batches are compressed using the [zlib](https://github.com/madler/zlib) algorithm with best compression level.',
    genesisState:
      'The genesis file can be found [here](https://github.com/blast-io/deployment/blob/master/mainnet/genesis.json).',
    dataFormat:
      "The format specification of Sequencer's data batches can be found [here](https://blog.oplabs.co/reproduce-bedrock-migration/).",
  },
  milestones: [
    {
      name: 'Blast Network Launch',
      link: 'https://x.com/Blast_L2/status/1763316176263008551?s=20',
      date: '2024-02-29T00:00:00Z',
      description: 'Blast Network is live on mainnet.',
      type: 'general',
    },
    {
      name: 'Blast upgrades to censor exploiter',
      link: 'https://x.com/miszke_eth/status/1772946372309737970',
      date: '2024-03-26T00:00:00Z',
      description:
        'The Munchables exploiter is prohibited from forcing transactions.',
      type: 'incident',
    },
    {
      name: 'Blast Mainnet starts using blobs',
      link: 'https://x.com/Blast_L2/status/1793686918506623032',
      date: '2024-05-27T00:00:00Z',
      description: 'Blast Mainnet starts publishing data to blobs.',
      type: 'general',
    },
  ],
})
