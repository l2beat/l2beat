import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { ESCROW, EXITS, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('blast')
const chainId = 81457

export const blast: ScalingProject = opStackL2({
  addedAt: UnixTime(1700555008), // 2023-11-21T08:23:28Z
  discovery,
  display: {
    name: 'Blast',
    slug: 'blast',
    architectureImage: 'blast',
    description:
      'Blast is an EVM-compatible Optimistic Rollup supporting native yield. It invests funds deposited into the L1 bridge into various DeFi protocols transferring yield back to the L2.',
    links: {
      websites: ['https://blast.io/en'],
      bridges: ['https://blast.io/en/bridge'],
      documentation: ['https://docs.blast.io/about-blast'],
      explorers: [
        'https://blastscan.io',
        'https://blastplorer.info/',
        'https://blastexplorer.io',
      ],
      repositories: ['https://github.com/blast-io'],
      socialMedia: ['https://twitter.com/blast', 'https://discord.gg/blast-l2'],
    },
    tvsWarning: {
      value: 'The TVS does account for rehypothecated tokens.',
      sentiment: 'bad',
    },
  },
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
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
            title:
              'OptimismPortal.sol - Etherscan source code, proveWithdrawalTransaction function',
            url: 'https://etherscan.io/address/0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391#code',
          },
          {
            title:
              'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
            url: 'https://etherscan.io/address/0xA280aEBF81c917DbD2aA1b39f979dfECEc9e4391#code',
          },
          {
            title: 'L2OutputOracle.sol - Etherscan source code, PROPOSER check',
            url: 'https://etherscan.io/address/0x1C90963D451316E3DBFdD5A30354EE56C29016EB#code',
          },
        ],
        risks: [EXITS.RISK_REHYPOTHECATED_ASSETS, EXITS.RISK_LACK_OF_LIQUIDITY],
      },
      {
        ...EXITS.FORCED_MESSAGING('all-messages'),
        references: [
          {
            title: 'Forced transaction from an OP Stack blockchain',
            url: 'https://docs.optimism.io/stack/transactions/forced-transaction',
          },
        ],
      },
    ],
  },
  chainConfig: {
    name: 'blast',
    coingeckoPlatform: 'blast',
    chainId,
    explorerUrl: 'https://blastscan.io',
    sinceTimestamp: UnixTime.fromDate(new Date('2024-02-24T21:23:35Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 88189,
        version: '3',
      },
    ],
    apis: [
      { type: 'rpc', url: 'https://rpc.blast.io/', callsPerMinute: 1500 },
      { type: 'etherscan', chainId },
    ],
  },
  genesisTimestamp: UnixTime(1708825259), //First sequencer transaction
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d',
      ),
      name: 'Pre-launch Blast Vault',
      description:
        'Pre-launch Blast Vault that keeps stETH. Funds from this Vault can be migrated to Blast bridge.',
      tokens: ['stETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x98078db053902644191f93988341E31289E1C8FE',
      ),
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
      title: 'Blast Network Launch',
      url: 'https://x.com/Blast_L2/status/1763316176263008551?s=20',
      date: '2024-02-29T00:00:00Z',
      description: 'Blast Network is live on mainnet.',
      type: 'general',
    },
    {
      title: 'Blast upgrades to censor exploiter',
      url: 'https://x.com/miszke_eth/status/1772946372309737970',
      date: '2024-03-26T00:00:00Z',
      description:
        'The Munchables exploiter is prohibited from forcing transactions.',
      type: 'incident',
    },
    {
      title: 'Blast Mainnet starts using blobs',
      url: 'https://x.com/Blast_L2/status/1793686918506623032',
      date: '2024-05-27T00:00:00Z',
      description: 'Blast Mainnet starts publishing data to blobs.',
      type: 'general',
    },
  ],
})
