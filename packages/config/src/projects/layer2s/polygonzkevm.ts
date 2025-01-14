import {
  ChainId,
  EthereumAddress,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { polygonCDKStack } from './templates/polygonCDKStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polygonzkevm')

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'PolygonZkEVMEtrog',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

const bridge = discovery.getContract('Bridge')
const upgradeDelayString = formatSeconds(
  discovery.getContractValue<number>('Timelock', 'getMinDelay'),
)

export const polygonzkevm: Layer2 = polygonCDKStack({
  createdAt: new UnixTime(1679651674), // 2023-03-24T09:54:34Z
  rollupModuleContract: discovery.getContract('PolygonZkEVMEtrog'),
  rollupVerifierContract: discovery.getContract('PolygonzkEVMVerifier'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning: 'The forced transaction mechanism is currently disabled.',
    description:
      'Polygon zkEVM is an EVM-compatible ZK Rollup built by Polygon Labs.',
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
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'EscrowsAdmin',
      'Escrows Admin can instantly upgrade wstETH, DAI and USDC bridges.',
    ),
    {
      name: 'LocalAdmin',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('PolygonZkEVMEtrog', 'admin'),
        ),
      ],
      description:
        'Admin of the PolygonZkEVMEtrog contract, can set core system parameters like timeouts, sequencer, activate forced transactions and update the DA mode. In the case on Polygon zkEVM, this is also the RollupManagerAdminMultisig.',
    },
  ],
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
  upgradesAndGovernance: [
    `All main contracts and the verifier are upgradable by the ${discovery.getMultisigStats(
      'RollupManagerAdminMultisig',
    )} \`ProxyAdminOwner\` through a timelock that owns \`SharedProxyAdmin\`. Addresses of trusted sequencer, aggregator and operational parameters (like fees) on the \`PolygonRollupManager\` can be instantly set by the \`ProxyAdminOwner\`. Escrow contracts are upgradable by the \`EscrowsAdmin\` ${discovery.getMultisigStats(
      'EscrowsAdmin',
    )} multisig.`,
    `\`PolygonZkEVMTimelock\` is a modified version of TimelockController that disables delay in case of a manually enabled or triggered emergency state in the \`PolygonRollupManager\`. It otherwise has a ${upgradeDelayString} delay.`,
    `The process to upgrade the \`PolygonRollupManager\`-implementation and / or the verifier has two steps: 1) A newRollupType-transaction is added by the \`ProxyAdminOwner\` to the timelock, which in turn can call the \`addNewRollupType()\` function in the \`PolygonRollupManager\`. In a non-emergency state, this allows potential reviews of the new rollup type while it sits in the timelock. 2) After the delay period, the rollup implementation can be upgraded to the new rollup type by the \`ProxyAdminOwner\` calling the \`updateRollup()\`-function in the \`PolygonRollupManager\` directly.`,
    `The critical roles in the \`PolygonRollupManager\` can be changed through the timelock, while the trusted Aggregator role can be granted by the \`ProxyAdminOwner\` directly.`,
    `The ${discovery.getMultisigStats(
      'SecurityCouncil',
    )} \`SecurityCouncil\` multisig can manually enable the emergency state in the \`PolygonRollupManager\`.`,
  ].join('\n\n'),
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
          name: 'PolygonZkEvmVerifier (current RollupType 5)',
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
      name: 'Polygon zkEVM Etrog upgrade',
      link: 'https://docs.polygon.technology/zkEVM/architecture/protocol/etrog-upgrade/#etrog-upgrade',
      date: '2024-02-13',
      description: 'Polygon zkEVM is upgraded to the Polygon Etrog version.',
      type: 'general',
    },
    {
      name: 'Polygon zkEVM Mainnet Beta is Live',
      link: 'https://polygon.technology/blog/polygon-zkevm-mainnet-beta-is-live?utm_source=twitter&utm_medium=social&utm_campaign=zkevm-launch&utm_term=mainnet-beta-live&utm_content=blog',
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
