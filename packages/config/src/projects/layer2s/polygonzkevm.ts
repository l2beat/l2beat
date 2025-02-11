import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  ESCROW,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { polygonCDKStack } from './templates/polygonCDKStack'

const discovery = new ProjectDiscovery('polygonzkevm')

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'PolygonZkEVMEtrog',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

const bridge = discovery.getContract('PolygonZkEVMBridgeV2')

export const polygonzkevm: Layer2 = polygonCDKStack({
  addedAt: new UnixTime(1679651674), // 2023-03-24T09:54:34Z
  rollupModuleContract: discovery.getContract('PolygonZkEVMEtrog'),
  rollupVerifierContract: discovery.getContract('FflonkVerifier_11'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning: 'The forced transaction mechanism is currently disabled.',
    description:
      'Polygon zkEVM is an EVM-compatible ZK Rollup built by Polygon Labs.',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      apps: ['https://portal.polygon.technology/bridge'],
      documentation: ['https://docs.polygon.technology/zkEVM/'],
      explorers: ['https://zkevm.polygonscan.com/'],
      repositories: ['https://github.com/0xPolygonHermez'],
      socialMedia: [
        'https://x.com/0xPolygon',
        'https://t.me/polygonofficial',
        'https://reddit.com/r/0xPolygon/',
        'https://discord.com/invite/0xPolygonCommunity',
        'https://discord.com/invite/0xpolygonRnD',
        'https://polygon.technology/blog',
      ],
      rollupCodes: 'https://rollup.codes/polygon-zkevm',
    },
    liveness: {
      explanation:
        'Polygon zkEVM is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. State updates are a three step process: first blocks are committed to L1, then they are proved, and then it is possible to execute them.',
    },
  },
  associatedTokens: ['POL', 'MATIC'],
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
    blockscoutV2ApiUrl: 'https://zkevm.blockscout.com/api/v2',
    explorerUrl: 'https://zkevm.polygonscan.com',
    explorerApi: {
      url: 'https://api-zkevm.polygonscan.com/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1679679015),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 57746,
        version: '3',
      },
    ],
  },
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x519E42c24163192Dca44CD3fBDCEBF6be9130987'),
        selector: '0xecef3f99',
        functionSignature:
          'function sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, address l2Coinbase)',
        sinceTimestamp: new UnixTime(1707824735),
        untilTimestamp: new UnixTime(1710419699),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x519E42c24163192Dca44CD3fBDCEBF6be9130987'),
        selector: '0xdef57e54',
        functionSignature:
          'function sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, uint64 maxSequenceTimestamp, uint64 initSequencedBatch, address l2Coinbase)',
        sinceTimestamp: new UnixTime(1710419699),
        untilTimestamp: new UnixTime(1736943371),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x519E42c24163192Dca44CD3fBDCEBF6be9130987'),
        selector: '0xb910e0f9',
        functionSignature:
          'function sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, uint32 l1InfoTreeLeafCount, uint64 maxSequenceTimestamp, bytes32 expectedFinalAccInputHash, address l2Coinbase)',
        sinceTimestamp: new UnixTime(1736943371),
      },
    },
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherPreminted',
        premintedAmount: '200000000000000000000000000',
      },
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB'),
      tokens: ['USDC'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom Bridge escrow for USDC bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01'),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom Bridge escrow for wstETH bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98'),
      tokens: ['DAI', 'sDAI'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom Bridge escrow for DAI bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
  ],
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
      references: [
        {
          title:
            'PolygonZkEVMEtrog.sol - Etherscan source code, verifyBatches function',
          url: 'https://etherscan.io/address/0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          title:
            'PolygonZkEVMEtrog.sol - Etherscan source code, sequenceBatches function',
          url: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
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
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'Polygon zkEVM proof system PIL-STARK can be found [here](https://github.com/0xPolygonHermez/pil-stark).',
      },
      {
        title: 'ZK Circuits',
        description:
          'Polygon zkEVM circuits are built from PIL and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/0xPolygonHermez/zkevm-rom).',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the proof system is implemented incorrectly.',
          },
        ],
      },
      {
        title: 'Verification Keys Generation',
        description:
          'SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this guide](https://github.com/0xPolygonHermez/zkevm-contracts/blob/main/verifyMainnetDeployment/verifyMainnetProofVerifier.md). The system requires a trusted setup.',
      },
    ],
    proofVerification: {
      shortDescription: 'Polygon zkEVM is a ZK-EVM rollup on Ethereum.',
      aggregation: true,
      requiredTools: [
        {
          name: 'circom',
          version: 'v2.1.8',
          link: 'https://github.com/iden3/circom/releases/tag/v2.1.8',
        },
      ],
      verifiers: [
        {
          name: 'PolygonZkEvmVerifier (old RollupType 5 and current RollupType 6)',
          description:
            'Polygon zkEVM utilizes [PIL-STARK](https://github.com/0xPolygonHermez/pil-stark) as the main proving stack for their system. PIL-STARK is an implementation of the [eSTARK](https://eprint.iacr.org/2023/474) protocol. The circuits and the computations are represented using the PIL and zkASM custom languages. The protocol makes use of recursive proof aggregation. The final eSTARK proof is wrapped in a fflonk proof.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0xc521580cd8586Cc688A7430F9DcE0f6A803F2883',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Final wrap',
              proofSystem: 'fflonk',
              mainArithmetization: 'Plonkish',
              mainPCS: 'KZG-fflonk',
              trustedSetup: 'Powers of Tau 28',
            },
            {
              name: 'Aggregation circuit',
              proofSystem: 'eSTARK',
              mainArithmetization: 'eAIR',
              mainPCS: 'FRI',
              trustedSetup: 'None',
            },
            {
              name: 'Polygon zkEVM ROM',
              proofSystem: 'eSTARK',
              mainArithmetization: 'eAIR',
              mainPCS: 'FRI',
              trustedSetup: 'None',
              link: 'https://github.com/0xPolygonHermez/zkevm-rom',
            },
          ],
        },
        {
          name: 'PolygonZkEvmVerifier (old RollupType 3)',
          description:
            'Polygon zkEVM utilizes [PIL-STARK](https://github.com/0xPolygonHermez/pil-stark) as the main proving stack for their system. PIL-STARK is an implementation of the [eSTARK](https://eprint.iacr.org/2023/474) protocol. The circuits and the computations are represented using the PIL and zkASM custom languages. The protocol makes use of recursive proof aggregation. The final eSTARK proof is wrapped in a fflonk proof.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x0775e11309d75aA6b0967917fB0213C5673eDf81',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Final wrap',
              proofSystem: 'fflonk',
              mainArithmetization: 'Plonkish',
              mainPCS: 'KZG-fflonk',
              trustedSetup: 'Powers of Tau 28',
            },
            {
              name: 'Aggregation circuit',
              proofSystem: 'eSTARK',
              mainArithmetization: 'eAIR',
              mainPCS: 'FRI',
              trustedSetup: 'None',
            },
            {
              name: 'Polygon zkEVM ROM',
              proofSystem: 'eSTARK',
              mainArithmetization: 'eAIR',
              mainPCS: 'FRI',
              trustedSetup: 'None',
              link: 'https://github.com/0xPolygonHermez/zkevm-rom',
            },
          ],
        },
      ],
    },
  },
  milestones: [
    {
      title: 'Polygon zkEVM Etrog upgrade',
      url: 'https://docs.polygon.technology/zkEVM/architecture/protocol/etrog-upgrade/#etrog-upgrade',
      date: '2024-02-13',
      description: 'Polygon zkEVM is upgraded to the Polygon Etrog version.',
      type: 'general',
    },
    {
      title: 'Polygon zkEVM Mainnet Beta is Live',
      url: 'https://polygon.technology/blog/polygon-zkevm-mainnet-beta-is-live?utm_source=twitter&utm_medium=social&utm_campaign=zkevm-launch&utm_term=mainnet-beta-live&utm_content=blog',
      date: '2023-03-27T00:00:00Z',
      description: 'Polygon zkEVM public beta launched.',
      type: 'general',
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
