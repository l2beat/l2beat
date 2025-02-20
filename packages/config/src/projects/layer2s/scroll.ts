import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  STATE_ZKP_SN,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ESCROW } from '../../common'
import { formatExecutionDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { PROOFS } from '../zk-catalog/common/proofSystems'
import { getStage } from './common/stages/getStage'

const discovery = new ProjectDiscovery('scroll')

const timelockSlowDelay = discovery.getContractValue<number>(
  'TimelockSlow',
  'getMinDelay',
)
const timelockFastDelay = discovery.getContractValue<number>(
  'TimelockFast',
  'getMinDelay',
)
const timelockSCDelay = discovery.getContractValue<number>(
  'TimelockSC',
  'getMinDelay',
)
const timelockEmergencyDelay = discovery.getContractValue<number>(
  'TimelockEmergency',
  'getMinDelay',
)

const upgradesSC = {
  upgradableBy: [{ name: 'SecurityCouncil', delay: 'no' }],
}

const isEnforcedTxGatewayPaused = discovery.getContractValue<boolean>(
  'EnforcedTxGateway',
  'paused',
)

const upgradeDelay = 0
const finalizationPeriod = 0

export const scroll: Layer2 = {
  type: 'layer2',
  id: ProjectId('scroll'),
  capability: 'universal',
  addedAt: new UnixTime(1679651674), // 2023-03-24T09:54:34Z
  badges: [Badge.VM.EVM, Badge.DA.EthereumBlobs],
  display: {
    name: 'Scroll',
    slug: 'scroll',
    description:
      'Scroll is ZK Rollup that extends Ethereum’s capabilities through ZK tech and EVM compatibility.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://scroll.io'],
      apps: ['https://scroll.io/bridge'],
      documentation: ['https://docs.scroll.io/en/home/'],
      explorers: [
        'https://scrollscan.com/',
        'https://ondora.xyz/network/scroll',
        'https://scroll.l2scan.co/',
        'https://okx.com/web3/explorer/scroll',
        'https://scroll.nftscan.com/',
      ],
      repositories: [
        'https://github.com/scroll-tech/scroll',
        'https://github.com/scroll-tech/scroll-prover',
        'https://github.com/scroll-tech/zkevm-circuits',
        'https://github.com/scroll-tech/zkevm-specs',
        'https://github.com/scroll-tech/scroll-zkevm',
        'https://github.com/scroll-tech/go-ethereum',
        'https://github.com/scroll-tech/frontends',
        'https://github.com/scroll-tech/scroll-contract-deploy-demo',
        'https://github.com/scroll-tech',
      ],
      socialMedia: [
        'https://discord.gg/scroll',
        'https://twitter.com/Scroll_ZKP',
        'https://youtube.com/@Scroll_ZKP',
      ],
      rollupCodes: 'https://rollup.codes/scroll',
    },
    liveness: {
      warnings: {
        batchSubmissions:
          'Transaction data batches that have not yet been proven can be reverted.',
      },
      explanation:
        'Scroll is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1, but the owner can revert them if the corresponding root has not yet be confirmed.',
    },
    finality: {
      warnings: {
        timeToInclusion: {
          sentiment: 'warning',
          value:
            'Transaction data batches that have not yet been proven can be reverted.',
        },
      },
      finalizationPeriod,
    },
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: false,
    },
    stage1: {
      principle: false,
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  chainConfig: {
    name: 'scroll',
    chainId: 534352,
    explorerUrl: 'https://scrollscan.com',
    explorerApi: {
      url: 'https://api.scrollscan.com/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1696917600),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 14,
        version: '3',
      },
    ],
    coingeckoPlatform: 'scroll',
  },
  config: {
    associatedTokens: ['SCR'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9'),
        tokens: '*',
        excludedTokens: ['rsETH'],
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367'),
        tokens: ['ETH'],
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xb2b10a289A229415a124EFDeF310C10cb004B6ff'), // custom gateway
        tokens: '*',
        ...ESCROW.CANONICAL_EXTERNAL,
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B'),
        tokens: ['USDC'],
        ...ESCROW.CANONICAL_EXTERNAL,
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x67260A8B73C5B77B55c1805218A42A7A6F98F515'),
        tokens: ['DAI'],
        ...ESCROW.CANONICAL_EXTERNAL,
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6625C6332c9F91F2D27c304E729B86db87A3f504'),
        tokens: ['wstETH'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'Custom token escrow with third-party governance, using the canonical bridge only for messaging.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA033Ff09f2da45f0e9ae495f525363722Df42b2a'),
        tokens: ['pufETH'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'Custom token escrow with third-party governance, using the canonical bridge only for messaging.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc.scroll.io',
      defaultCallsPerMinute: 120,
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
        sequencers: [
          '0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B',
          '0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858',
        ],
      },
    ],
    trackedTxs: [
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
          address: EthereumAddress(
            '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
          ),
          selector: '0x31fa742d',
          functionSignature:
            'function finalizeBatchWithProof(bytes _batchHeader,bytes32 _prevStateRoot,bytes32 _postStateRoot,bytes32 _withdrawRoot,bytes _aggrProof)',
          sinceTimestamp: new UnixTime(1696782323),
          untilTimestamp: new UnixTime(1724227415),
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
          address: EthereumAddress(
            '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
          ),
          selector: '0x00b0f4d7',
          functionSignature:
            'function finalizeBatchWithProof4844(bytes _batchHeader, bytes32 _prevStateRoot, bytes32 _postStateRoot, bytes32 _withdrawRoot, bytes _blobDataProof, bytes _aggrProof)',
          sinceTimestamp: new UnixTime(1714362335), // first blob tx: https://etherscan.io/tx/0x0c2b6063a92ab124c45ef518c12fe181a5728bb3a40015270493bd430ed400ea
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
          ),
          selector: '0x4f099e3d',
          functionSignature:
            'function finalizeBundleWithProof(bytes,bytes32,bytes32,bytes)',
          sinceTimestamp: new UnixTime(1724227415),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
          ),
          selector: '0x1325aca0',
          functionSignature:
            'function commitBatch(uint8 _version,bytes _parentBatchHeader,bytes[] _chunks,bytes _skippedL1MessageBitmap)',
          sinceTimestamp: new UnixTime(1696782323),
          untilTimestamp: new UnixTime(1724227247),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
          ),
          selector: '0x86b053a9',
          functionSignature:
            'function commitBatchWithBlobProof(uint8,bytes,bytes[],bytes,bytes)',
          sinceTimestamp: new UnixTime(1724227415),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
    finality: {
      lag: 0,
      type: 'Scroll',
      // Scroll L1 Chain Proxy deployment
      minTimestamp: new UnixTime(1696775129),
      stateUpdate: 'disabled',
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  riskView: {
    stateValidation: {
      ...STATE_ZKP_SN,
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    newCryptography: NEW_CRYPTOGRAPHY.ZK_SNARKS,
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          title:
            'ScrollChain.sol - Etherscan source code, verifyAggregateProof() and verifyBundleProof() calls',
          url: 'https://etherscan.io/address/0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f#code',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title:
            'ScrollChain.sol - Etherscan source code commitBatch() and commitBatchWithBlobProof() functions',
          url: 'https://etherscan.io/address/0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title:
            'ScrollChain.sol - Etherscan source code, finalizeBundleWithProof() function modifier',
          url: 'https://etherscan.io/address/0x9bB163401E8C72573854c4Cd968aFA7A7b02D25f#code',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          title: 'EnforcedTxGateway.sol - Etherscan source code',
          url: 'https://etherscan.io/address/0x642af405bF64660665B37977449C9C536B806318#code',
        },
        {
          title: 'EnforcedTxGateway is paused - Etherscan proxy contract',
          url: 'https://etherscan.io/address/0x72CAcBcfDe2d1e19122F8A36a4d6676cd39d7A5d#readProxyContract#F7',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('zk'),
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            title:
              'L1ETHGateway.sol - Etherscan source code, finalizeWithdrawETH function',
            url: 'https://etherscan.io/address/0x546E0bF31FB6e7babD493452e4e6999191367B42#code',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The node software to reconstruct the state is available [here](https://github.com/scroll-tech/go-ethereum). Note that it uses the L2 p2p network to fetch blocks, and not the L1 network. The consistency with L1 data can be checked by running the [scroll-geth node](https://github.com/scroll-tech/go-ethereum) with the `--rollup.verify` flag.',
    compressionScheme:
      'Data batches are compressed using the [zlib](https://github.com/madler/zlib) algorithm with best compression level.',
    genesisState:
      'The genesis file can be found [here](https://scrollzkp.notion.site/genesis-json-f89ca24b123f462f98c8844d17bdbb74), which contains two prefunded addresses and five predeployed contracts.',
    dataFormat:
      'Blocks are grouped into chunks, chunks are grouped into batches, and batches are grouped into bundles. Chunk encoding format can be found [here](https://github.com/scroll-tech/scroll-contracts/blob/main/src/libraries/codec/ChunkCodecV0.sol#L5), and batch encoding format can be found [here](https://github.com/scroll-tech/scroll-contracts/blob/main/src/libraries/codec/BatchHeaderV0Codec.sol#L7).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'The prover code can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/develop/prover).',
      },
      {
        title: 'ZK Circuits',
        description:
          'Scroll circuits are based on the Halo2 proof system and are designed to replicate the behavior of the EVM. The source code of the base circuits can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.5/zkevm-circuits) while the code for the aggregation circuits can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.5/aggregator).',
      },
      {
        title: 'Verification Keys Generation',
        description:
          'SNARK verification keys can be generated and checked against Ethereum verifier contract using [this guide](https://github.com/scroll-tech/scroll-prover#verifier-contract). The system requires a trusted setup.',
      },
    ],
    proofVerification: {
      shortDescription: 'Scroll is a ZK-EVM rollup on Ethereum.',
      aggregation: true,
      requiredTools: [
        {
          name: 'Custom tool',
          version: 'v0.10.3',
          link: 'https://github.com/scroll-tech/scroll-prover/tree/v0.10.3?tab=readme-ov-file#verifier-contract',
        },
      ],
      verifiers: [
        {
          name: 'PlonkVerifierV0',
          description:
            'Scroll verifier using calldata for DA. Corresponds to version v0.9.5 of the circuits.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x4B8Aa8A96078689384DAb49691E9bA51F9d2F9E1',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Aggregation circuit',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.9.5/aggregator',
            },
            {
              name: 'Main circuit',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.9.5/zkevm-circuits',
            },
          ],
        },
        {
          name: 'PlonkVerifierV1',
          description:
            'Scroll verifier using blobs for DA. Corresponds to version v0.10.3 of the circuits.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x2293cd12e8564e8219d314b075867c2f66ac6941',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Aggregation circuit',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.3/aggregator',
            },
            {
              name: 'Main circuit',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.3/zkevm-circuits',
            },
          ],
        },
        {
          name: 'PlonkVerifierV1-1',
          description:
            'Scroll verifier using blobs for DA. Corresponds to version v0.11.4 of the circuits (Curie upgrade).',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x03a72B00D036C479105fF98A1953b15d9c510110',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Aggregation circuit',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.11.4/aggregator',
            },
            {
              name: 'Main verifier',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.11.4/zkevm-circuits',
            },
          ],
        },
        {
          name: 'PlonkVerifierV2',
          description:
            'Scroll verifier proving bundles (group of batches). Corresponds to version v0.12.0 of the circuits (Darwin upgrade).',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x8759E83b6570A0bA46c3CE7eB359F354F816c9a9',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Aggregation circuit',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.12.0/aggregator',
            },
            {
              name: 'Main verifier',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.12.0/zkevm-circuits',
            },
          ],
        },
        {
          name: 'PlonkVerifierV2-1',
          description:
            'Scroll verifier proving bundles (group of batches). Corresponds to version v0.13.0 of the circuits (Darwin v2 upgrade).',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x8c1b52757b5c571ADcB5572E992679d4D48e30f7',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Aggregation circuit',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.13.0/aggregator',
            },
            {
              name: 'Main verifier',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.13.0/zkevm-circuits',
            },
          ],
        },
      ],
    },
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('ScrollChain', {
          description:
            'The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist. L1 -> L2 message processing on L2 is not enforced.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1ScrollMessenger', {
          description:
            'Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1MessageQueue', {
          description:
            'Contains the array of queued L1 -> L2 messages, either appended using the L1ScrollMessenger or the EnforcedTxGateway. The latter contract, which would allow users to send L2 messages from L1 with their own address as the sender, is not enabled yet.',
        }),
        discovery.getContractDetails('Whitelist', {
          description:
            'Contract implementing a generic whitelist. Currently used to define the actor that can relay the L2 basefee on L1.',
        }),
        discovery.getContractDetails('ScrollOwner', {
          description:
            'Owner of all contracts in the system. It implements an extension of AccessControl that manages roles and functions allowed to be called by each role.',
        }),
        discovery.getContractDetails('TimelockSlow', {
          description: `${formatSeconds(
            timelockSlowDelay,
          )} timelock. Admin of the ScrollOwner contract, meaning it can assign and revoke roles. The SecurityCouncil can propose, cancel and execute transactions, and the ExecutorMultisig can execute them.`,
        }),
        discovery.getContractDetails('TimelockFast', {
          description: `${formatSeconds(
            timelockFastDelay,
          )} timelock. Can add new sequencers and provers, update the gas oracle and permissions to update its values, the max gas limit, and gateways token mappings. The ScrollOpsMultisig can propose and cancel transactions, and the ScrollExecutorMultisig can execute them. Currently also has the Admin role in the ScrollOwner contract and can thus manage all roles including the ones that can upgrade all system contracts.`,
        }),
        discovery.getContractDetails('TimelockSC', {
          description: `${formatSeconds(
            timelockSCDelay,
          )} timelock. Can upgrade all core system contracts via the ProxyAdmin. The SecurityCouncil can propose, cancel and execute transactions, and the ScrollExecutorMultisig can execute them.`,
        }),
        discovery.getContractDetails('TimelockEmergency', {
          description: `${formatSeconds(
            timelockEmergencyDelay,
          )} timelock. Can pause system contracts, revert batches and remove sequencers. The ScrollEmergencyMultisig can propose and cancel transactions, and the ScrollExecutorMultisig can execute them.`,
        }),
        discovery.getContractDetails('MultipleVersionRollupVerifier', {
          description:
            'Contract used to update the verifier and keep track of current and old versions.',
        }),
        discovery.getContractDetails('ZkEvmVerifierV0', {
          description:
            'Current verifier using calldata for DA, used to prepare data for the PlonkVerifierV0.',
        }),
        discovery.getContractDetails('PlonkVerifierV0', {
          description:
            'Plonk verifier used to verify ZK proofs using calldata for DA.',
        }),
        discovery.getContractDetails('ZkEvmVerifierV1', {
          description:
            'Verifier using blobs for DA, used to prepare data for the PlonkVerifierV1.',
        }),
        discovery.getContractDetails('PlonkVerifierV1', {
          description:
            'Plonk verifier used to verify ZK proofs using blobs for DA.',
        }),
        discovery.getContractDetails('ZkEvmVerifierV1-1', {
          description:
            'Verifier using blobs for DA, used to prepare data for the PlonkVerifierV1-1. Added in the Curie upgrade.',
        }),
        discovery.getContractDetails('PlonkVerifierV1-1', {
          description:
            'Plonk verifier used to verify ZK proofs using blobs for DA.',
        }),
        discovery.getContractDetails('ZkEvmVerifierV2', {
          description:
            'Verifier proving bundles (group of batches), used to prepare data for the PlonkVerifierV2. Added in the Darwin upgrade.',
        }),
        discovery.getContractDetails('PlonkVerifierV2', {
          description: 'Plonk verifier used to verify ZK proofs for bundles.',
        }),
        discovery.getContractDetails('ZkEvmVerifierV2-1', {
          description:
            'Verifier proving bundles (group of batches), used to prepare data for the PlonkVerifierV2-1. Added in the Darwin v2 upgrade.',
        }),
        discovery.getContractDetails('PlonkVerifierV2-1', {
          description: 'Plonk verifier used to verify ZK proofs for bundles.',
        }),
        discovery.getContractDetails('L1ETHGateway', {
          description: 'Deprecated: Contract used to bridge ETH from L1 to L2.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1WETHGateway', {
          description: 'Contract used to bridge WETH from L1 to L2.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1BatchBridgeGateway', {
          description:
            'Contract used to efficiently bridge ETH (in batches) from L1 to L2.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1StandardERC20Gateway', {
          description:
            'Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1CustomERC20Gateway', {
          description:
            'Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1USDCGateway', {
          description: 'Contract used to bridge USDC tokens from L1 to L2.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1ERC721Gateway', {
          description: 'Contract used to bridge ERC721 tokens from L1 to L2.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1ERC1155Gateway', {
          description: 'Contract used to bridge ERC1155 tokens from L1 to L2.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('L1GatewayRouter', {
          description:
            'Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.',
          ...upgradesSC,
        }),
        discovery.getContractDetails('ScrollFeeVaultMultisig', {
          description:
            'Multisig used to store fees collected from gateways to pay for L1 -> L2 message execution.',
        }),
        discovery.getContractDetails('EnforcedTxGateway', {
          description:
            'Contracts to force L1 -> L2 messages with the proper sender.',
          ...upgradesSC,
          pausable: {
            paused: isEnforcedTxGatewayPaused,
            pausableBy: ['ScrollOwner'],
          },
        }),
        discovery.getContractDetails('OLD_L2GasPriceOracle', {
          description:
            'Deprecated: the functionality of this contract has been moved to the L1MessageQueue contract. It was used to relay the L2 basefee on L1 in a trusted way using a whitelist. It was also used to store and update values related to intrinsic gas cost calculations.',
          ...upgradesSC,
        }),
      ],
    },
    risks: [],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getMultisigPermission(
          'ScrollOpsMultisig',
          'Can propose transactions via the TimelockFast, which currently can manage all roles in the ScrollOwner and thus get access to full upgrade and system functions. The ScrollExecutorMultisig needs to execute these proposals once ready.',
        ),
        discovery.getMultisigPermission(
          'SecurityCouncil',
          'Can upgrade all system contracts via the TimelockSC and the ProxyAdmin and manage all critical roles in the ScrollOwner via the TimelockSlow. The ScrollExecutorMultisig can execute these proposals, but the SC is also permissioned to execute them.',
        ),
        discovery.getMultisigPermission(
          'ScrollExecutorMultisig',
          'Can execute timelock transactions in all four timelocks.',
        ),
        discovery.getMultisigPermission(
          'ScrollEmergencyMultisig',
          'Can revert batches, remove sequencers and provers, and pause contracts via the TimelockEmergency. The ScrollExecutorMultisig needs to execute these proposals.',
        ),
        discovery.getPermissionDetails(
          'Sequencers',
          discovery.getPermissionedAccounts('ScrollChain', 'sequencers'),
          'Actors allowed to commit transaction batches.',
        ),
        discovery.getPermissionDetails(
          'Proposers',
          discovery.getPermissionedAccounts('ScrollChain', 'provers'),
          'Actors allowed to prove transaction batches and publish state root updates.',
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Batches reverted',
      url: 'https://status.scroll.io/incidents/44k6s4qg6kcs',
      date: '2024-07-05T00:00:00Z',
      description:
        'To fix a bug in the compression for batches 55 previously committed batches are reverted.',
      type: 'incident',
    },
    {
      title: 'Darwin upgrade',
      url: 'https://scroll.io/blog/proof-recursion-scrolls-darwin-upgrade',
      date: '2024-08-21T00:00:00.00Z',
      description:
        'Introduces a reduction in gas fees through bundling multiple batches into a single validity proof.',
      type: 'general',
    },
    {
      title: 'Curie upgrade',
      url: 'https://scroll.io/blog/compressing-the-gas-scrolls-curie-upgrade',
      date: '2024-07-03T00:00:00.00Z',
      description:
        'Introduces data compression, new opcodes, dynamic block time, and new transaction types.',
      type: 'general',
    },
    {
      title: 'Bernoulli upgrade',
      url: 'https://scroll.io/blog/blobs-are-here-scrolls-bernoulli-upgrade',
      date: '2024-04-29T00:00:00.00Z',
      description:
        'Introduces EIP-4844 data blobs for L1 data availability, and the SHA2-256 precompile on L2.',
      type: 'general',
    },
    {
      title: 'Scroll official launch',
      url: 'https://x.com/Scroll_ZKP/status/1714286874020528554',
      date: '2023-10-17T00:00:00.00Z',
      description: 'Scroll announces its official launch.',
      type: 'general',
    },
    {
      title: 'Scroll Alpha testnet launch',
      url: 'https://scroll.io/blog/alphaTestnet',
      date: '2023-02-27T00:00:00.00Z',
      description: 'Scroll launches its Alpha testnet on Goerli.',
      type: 'general',
    },
  ],
}
