import {
  ChainId,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { polygonCDKStack } from '../../templates/polygonCDKStack'

const discovery = new ProjectDiscovery('polygonzkevm')

const isForcedBatchDisallowed =
  discovery.getContractValue<string>('PolygonZkEVM', 'forceBatchAddress') !==
  '0x0000000000000000000000000000000000000000'

const bridge = discovery.getContract('PolygonSharedBridge')

const chainId = 1101

export const polygonzkevm: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1679651674), // 2023-03-24T09:54:34Z
  rollupModuleContract: discovery.getContract('PolygonZkEVM'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning: 'The forced transaction mechanism is currently disabled.',
    description:
      'Polygon zkEVM is an EVM-compatible ZK Rollup built by Polygon Labs.',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      bridges: ['https://portal.polygon.technology/bridge'],
      documentation: ['https://docs.polygon.technology/zkEVM/'],
      explorers: ['https://zkevm.polygonscan.com/'],
      repositories: [
        'https://github.com/0xPolygon/zkevm-node',
        'https://github.com/0xPolygon/',
      ],
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
  activityConfig: {
    type: 'block',
    startBlock: 1,
  },
  chainConfig: {
    name: 'polygonzkevm',
    chainId,
    explorerUrl: 'https://zkevm.polygonscan.com',
    sinceTimestamp: UnixTime(1679679015),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 57746,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://polygon-rpc.com/zkevm',
        callsPerMinute: 500,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://zkevm.blockscout.com/api/v2' },
    ],
  },
  nonTemplateTrackedTxs: [
    // mostly pre-agglayer trackedTxs when polygonzkevm was the only significant chain
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
        selector: '0x5e9145c9',
        functionSignature:
          'function sequenceBatches((bytes,bytes32,uint64,uint64)[] batches,address l2Coinbase)',
        sinceTimestamp: UnixTime(1679653163),
        untilTimestamp: UnixTime(1707822059),
      },
    },
    {
      uses: [
        {
          type: 'liveness',
          subtype: 'stateUpdates',
        },
        {
          type: 'l2costs',
          subtype: 'stateUpdates',
        },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
        selector: '0x2b0006fa',
        functionSignature:
          'function verifyBatchesTrustedAggregator(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] proof)',
        sinceTimestamp: UnixTime(1679653163),
        untilTimestamp: UnixTime(1707822059),
      },
    },
    {
      uses: [
        {
          type: 'liveness',
          subtype: 'stateUpdates',
        },
        {
          type: 'l2costs',
          subtype: 'stateUpdates',
        },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
        selector: '0x621dd411',
        functionSignature:
          'function verifyBatches(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] calldata proof) ',
        sinceTimestamp: UnixTime(1679653163),
        untilTimestamp: UnixTime(1707822059),
      },
    },
    // shared trackedtxs for all agglayer chains
    {
      uses: [
        {
          type: 'liveness',
          subtype: 'stateUpdates',
        },
        {
          type: 'l2costs',
          subtype: 'stateUpdates',
        },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
        selector: '0x87c20c01',
        functionSignature:
          'function verifyBatches(uint32,uint64,uint64,uint64,bytes32,bytes32,address,bytes32[24])',
        sinceTimestamp: UnixTime(1707822059),
        untilTimestamp: UnixTime(1738594559),
      },
    },
    {
      uses: [
        {
          type: 'liveness',
          subtype: 'stateUpdates',
        },
        {
          type: 'l2costs',
          subtype: 'stateUpdates',
        },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
        selector: '0x1489ed10',
        functionSignature:
          'function verifyBatchesTrustedAggregator(uint32,uint64,uint64,uint64,bytes32,bytes32,address,bytes32[24])',
        sinceTimestamp: UnixTime(1707822059),
      },
    },
    // project-specific trackedTxs (polygonZkEVM)
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
        sinceTimestamp: UnixTime(1707824735),
        untilTimestamp: UnixTime(1710419699),
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
        sinceTimestamp: UnixTime(1710419699),
        untilTimestamp: UnixTime(1736943371),
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
        sinceTimestamp: UnixTime(1736943371),
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
      address: ChainSpecificAddress(
        'eth:0x70E70e58ed7B1Cec0D8ef7464072ED8A52d755eB',
      ),
      tokens: ['USDC'],
      description:
        'Custom Bridge escrow for USDC bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xf0CDE1E7F0FAD79771cd526b1Eb0A12F69582C01',
      ),
      tokens: ['wstETH'],
      description:
        'Custom Bridge escrow for wstETH bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x4A27aC91c5cD3768F140ECabDe3FC2B2d92eDb98',
      ),
      tokens: ['DAI', 'sDAI'],
      description:
        'Custom Bridge escrow for DAI bridged to PolygonZkEVM allowing for a custom L2 tokens contract.',
    }),
  ],
  isForcedBatchDisallowed,
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
          'Polygon zkEVM circuits are built from PIL (polynomial identity language) and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/0xPolygonHermez/zkevm-rom).',
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
      {
        title: 'Pessimistic Proofs',
        description:
          'The pessimistic proofs that are used to prove correct accounting in the shared bridge are using the [SP1 zkVM by Succinct](https://github.com/succinctlabs/sp1).',
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
})
