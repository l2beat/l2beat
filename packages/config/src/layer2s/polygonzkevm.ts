import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import {
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { polygonCDKStack } from './templates/polygonCDKStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polygonzkevm')

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'PolygonZkEVMEtrog',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

const ESCROW_wstETH_ADDRESS = '0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01'
const ESCROW_USDC_ADDRESS = '0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB'
const ESCROW_DAI_ADDRESS = '0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98'

export const polygonzkevm: Layer2 = polygonCDKStack({
  rollupManagerContract: discovery.getContract('PolygonRollupManager'),
  rollupModuleContract: discovery.getContract('PolygonZkEVMEtrog'),
  rollupVerifierContract: discovery.getContract('PolygonzkEVMVerifier'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning: 'The forced transaction mechanism is currently disabled.',
    description:
      'Polygon zkEVM is a EVM-compatible ZK Rollup built by Polygon Labs.',
    purposes: ['Universal'],
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      apps: ['https://bridge.zkevm-rpc.com'],
      documentation: [
        'https://wiki.polygon.technology/docs/zkEVM/introduction',
      ],
      explorers: [
        'https://zkevm.polygonscan.com/',
        'https://explorer.mainnet.zkevm-test.net/',
      ],
      repositories: ['https://github.com/0xPolygonHermez'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://discord.gg/XvpHAxZ',
        'https://polygon.technology/blog-tags/polygon-zk',
      ],
      rollupCodes: 'https://rollup.codes/polygon-zkevm',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation:
        'Polygon zkEVM is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. State updates are a three step process: first blocks are committed to L1, then they are proved, and then it is possible to execute them.',
    },
  },
  discovery,
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://polygon-rpc.com/zkevm',
    defaultCallsPerMinute: 500,
    startBlock: 1,
  },
  chainConfig: {
    name: 'polygonzkevm',
    chainId: 1101,
    explorerUrl: 'https://zkevm.polygonscan.com',
    explorerApi: {
      url: 'https://api-zkevm.polygonscan.com/api',
      type: 'etherscan',
    },
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 57746,
        version: '3',
      },
    ],
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'EscrowsAdmin',
      'Escrows Admin can instantly upgrade wstETH, DAI and USDC bridges.',
    ),
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress(ESCROW_wstETH_ADDRESS),
      sinceTimestamp: new UnixTime(1703945135),
      tokens: ['wstETH'],
      description: 'Escrow for wstETH',
      upgradableBy: ['EscrowAdmin'],
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress(ESCROW_USDC_ADDRESS),
      sinceTimestamp: new UnixTime(1700125979),
      tokens: ['USDC'],
      description: 'Escrow for USDC',
      upgradableBy: ['EscrowAdmin'],
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress(ESCROW_DAI_ADDRESS),
      sinceTimestamp: new UnixTime(1695199499),
      tokens: ['DAI', 'sDAI'],
      description: 'Escrow for DAI',
      upgradableBy: ['EscrowAdmin'],
    }),
  ],
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
      references: [
        {
          text: 'PolygonZkEVMEtrog.sol - Etherscan source code, verifyBatches function',
          href: 'https://etherscan.io/address/0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'PolygonZkEVMEtrog.sol - Etherscan source code, sequenceBatches function',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
    operator: {
      name: 'The system has a centralized sequencer',
      description:
        'Only a trusted sequencer is allowed to submit transaction batches. A mechanism for users to submit their own batches is currently disabled.',
      risks: [
        FRONTRUNNING_RISK,
        {
          category: 'Funds can be frozen if',
          text: 'the sequencer refuses to include an exit transaction.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'PolygonZkEVMEtrog.sol - Etherscan source code, onlyTrustedSequencer modifier',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      description:
        'The mechanism for allowing users to submit their own transactions is currently disabled.',
      references: [
        {
          text: 'PolygonZkEVMEtrog.sol - Etherscan source code, forceBatchAddress address',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
  },
  isForcedBatchDisallowed,
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygonHermez/zkevm-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the [`_legacyBatchNumToStateRoot`](https://evm.storage/eth/19489007/0x5132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2/_legacyBatchNumToStateRoot#map) variable of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/0d0e69a6f299e273343461f6350343cf4b048269/deployment/genesis.json).',
    dataFormat:
      'The trusted sequencer batches transactions according to the specifications documented [here](https://docs.polygon.technology/zkEVM/architecture/protocol/transaction-life-cycle/transaction-batching/).',
  },
  milestones: [
    {
      name: 'Polygon zkEVM Etrog upgrade',
      link: 'https://docs.polygon.technology/zkEVM/architecture/protocol/etrog-upgrade/#etrog-upgrade',
      date: '2024-02-13',
      description: 'Polygon zkEVM is upgraded to the Polygon Etrog version.',
    },
    {
      name: 'Polygon zkEVM Mainnet Beta is Live',
      link: 'https://polygon.technology/blog/polygon-zkevm-mainnet-beta-is-live?utm_source=twitter&utm_medium=social&utm_campaign=zkevm-launch&utm_term=mainnet-beta-live&utm_content=blog',
      date: '2023-03-27T00:00:00Z',
      description: 'Polygon zkEVM public beta launched.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'State diffs vs raw tx data',
      url: 'https://twitter.com/krzKaczor/status/1641505354600046594',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
})
