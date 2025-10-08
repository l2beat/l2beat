import {
  ChainId,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  ESCROW,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  STATE_ZKP_ST_SN_WRAP,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatExecutionDelay } from '../../common/formatDelays'
import { PROOFS } from '../../common/proofSystems'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('scroll')

const enforcedModeDelayParameters = discovery.getContractValue<{
  maxDelayEnterEnforcedMode: number
  maxDelayMessageQueue: number
}>('SystemConfig', 'enforcedBatchParameters')

const maxDelayEnterEnforcedMode =
  enforcedModeDelayParameters.maxDelayEnterEnforcedMode
const maxDelayMessageQueue = enforcedModeDelayParameters.maxDelayMessageQueue

const minSelfSequenceDelay = Math.min(
  maxDelayMessageQueue,
  maxDelayEnterEnforcedMode,
)

const cooldownPeriod = discovery.getContractValue<number>(
  'PauseController',
  'pauseCooldownPeriod',
)

const upgradesSC = {
  upgradableBy: [{ name: 'Scroll Security Council', delay: 'no' }],
}

const upgradeDelay = discovery.getContractValue<number>(
  'TimelockSCEmergency',
  'getMinDelay',
)

const finalizationPeriod = 0 // state root immediately finalized when proven
const chainId = 534352

export const scroll: ScalingProject = {
  type: 'layer2',
  id: ProjectId('scroll'),
  capability: 'universal',
  addedAt: UnixTime(1679651674), // 2023-03-24T09:54:34Z
  badges: [BADGES.VM.EVM, BADGES.DA.EthereumBlobs],
  display: {
    name: 'Scroll',
    slug: 'scroll',
    description:
      'Scroll is ZK Rollup that extends Ethereum’s capabilities through ZK tech and EVM compatibility.',
    purposes: ['Universal'],
    links: {
      websites: ['https://scroll.io'],
      bridges: ['https://scroll.io/bridge'],
      documentation: ['https://docs.scroll.io/en/home/'],
      explorers: [
        'https://scrollscan.com/',
        'https://scroll.blockscout.com/',
        'https://okx.com/web3/explorer/scroll',
      ],
      repositories: [
        'https://github.com/scroll-tech/scroll',
        'https://github.com/scroll-tech/zkvm-prover',
        'https://github.com/scroll-tech/go-ethereum',
        'https://github.com/scroll-tech/frontends',
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
        'Scroll is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1, but the owner can revert them if the corresponding root has not yet been confirmed.',
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('openvmprover'),
  },
  scopeOfAssessment: {
    inScope: [
      'Ability to deposit, spend, and withdraw the gas token (ETH)',
      'Upgradability of L1 and L2 core contracts',
      'Forced transaction mechanism via L1',
    ],
    notInScope: ['Upgradability of other external ERC20 token contracts'],
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/scroll-tech/go-ethereum',
      securityCouncilReference:
        'https://scroll-governance-documentation.vercel.app/gov-docs/content/what-is-security-council',
    },
  ),
  chainConfig: {
    name: 'scroll',
    chainId,
    explorerUrl: 'https://scrollscan.com',
    sinceTimestamp: UnixTime(1696917600),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 14,
        version: '3',
      },
    ],
    gasTokens: ['ETH'],
    coingeckoPlatform: 'scroll',
    apis: [
      { type: 'rpc', url: 'https://rpc.scroll.io', callsPerMinute: 120 },
      { type: 'etherscan', chainId },
    ],
  },
  config: {
    associatedTokens: ['SCR'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9',
        ),
        tokens: '*',
        excludedTokens: ['rsETH'],
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367',
        ),
        tokens: ['ETH'],
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xb2b10a289A229415a124EFDeF310C10cb004B6ff',
        ), // custom gateway
        tokens: '*',
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B',
        ),
        tokens: ['USDC'],
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x67260A8B73C5B77B55c1805218A42A7A6F98F515',
        ),
        tokens: ['DAI'],
        ...upgradesSC,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x6625C6332c9F91F2D27c304E729B86db87A3f504',
        ),
        tokens: ['wstETH'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'Custom token escrow with third-party governance, using the canonical bridge only for messaging.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xA033Ff09f2da45f0e9ae495f525363722Df42b2a',
        ),
        tokens: ['pufETH'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'Custom token escrow with third-party governance, using the canonical bridge only for messaging.',
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: EthereumAddress('0xa13BAF47339d63B743e7Da8741db5456DAc1E556'),
        sequencers: [
          EthereumAddress('0x054a47B9E2a22aF6c0CE55020238C8FEcd7d334B'),
          EthereumAddress('0xE514A8aE91d164C6Fb48a7DE336e10C34AF4e858'),
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
          sinceTimestamp: UnixTime(1696782323),
          untilTimestamp: UnixTime(1724227415),
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
          sinceTimestamp: UnixTime(1714362335), // first blob tx: https://etherscan.io/tx/0x0c2b6063a92ab124c45ef518c12fe181a5728bb3a40015270493bd430ed400ea
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
          sinceTimestamp: UnixTime(1724227415),
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
          selector: '0xc1aa4e19',
          functionSignature:
            'function finalizeBundlePostEuclidV2(bytes,uint256,bytes32,bytes32,bytes)',
          sinceTimestamp: UnixTime(1745508700),
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
          sinceTimestamp: UnixTime(1696782323),
          untilTimestamp: UnixTime(1724227247),
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
          sinceTimestamp: UnixTime(1724227415),
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
          selector: '0x9bbaa2ba',
          functionSignature:
            'function commitBatches(uint8 version, bytes32 parentBatchHash, bytes32 lastBatchHash)',
          sinceTimestamp: UnixTime(1745508700),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  riskView: {
    stateValidation: {
      ...STATE_ZKP_ST_SN_WRAP,
      executionDelay: finalizationPeriod,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure:
      RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(minSelfSequenceDelay),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title:
            'ScrollChain.sol - Etherscan source code commitBatches() function',
          url: 'https://etherscan.io/address/0x0a20703878E68E587c59204cc0EA86098B8c3bA7#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          title:
            'ScrollChain.sol - Etherscan source code, finalizeBundlePostEuclidV2() function modifier',
          url: 'https://etherscan.io/address/0x0a20703878E68E587c59204cc0EA86098B8c3bA7#code',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      description:
        FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract').description +
        ` The enforced liveness mechanism is activated if either an L1 message has not been finalized for more than ${formatSeconds(
          maxDelayMessageQueue,
        )} or a batch has not been finalized for more than ${formatSeconds(
          maxDelayEnterEnforcedMode,
        )}. When activated, transactions that were directly posted to the smart contract can be forcefully included by anyone on the host chain, which finalizes their ordering.`,
      references: [
        {
          title: 'EnforcedTxGateway.sol - Etherscan source code',
          url: 'https://etherscan.io/address/0x7e87c75BBe7991bbCEBd2C7a56f4cFC923BDDBcc#code',
        },
        {
          title: 'L1MessageQueueV2 - Etherscan proxy contract',
          url: 'https://etherscan.io/address/0x39C36c9026ac18104839A50c61a4507ea5052ECa',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('zk'),
        risks: [],
        references: [
          {
            title:
              'L1ETHGateway.sol - Etherscan source code, finalizeWithdrawETH function',
            url: 'https://etherscan.io/address/0x1fee6a6dC49095FB9C84D61aa4b8A07284b2A1d0#code',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The node software to reconstruct the state is available [here](https://github.com/scroll-tech/go-ethereum). Note that it uses the L2 p2p network to fetch blocks, and not the L1 network. The consistency with L1 data can be checked by running the [scroll-geth node](https://github.com/scroll-tech/go-ethereum) with the `--rollup.verify` flag.',
    compressionScheme:
      'Data batches are compressed using the [zstd](https://github.com/facebook/zstd) algorithm.',
    genesisState:
      'The genesis file can be found [here](https://scrollzkp.notion.site/genesis-json-f89ca24b123f462f98c8844d17bdbb74), which contains two prefunded addresses and five predeployed contracts.',
    dataFormat:
      'Blocks are grouped into chunks, chunks are grouped into batches, and batches are grouped into bundles. Chunk encoding format can be found [here](https://github.com/scroll-tech/scroll-contracts/blob/main/src/libraries/codec/ChunkCodecV0.sol#L5), and batch encoding format can be found [here](https://github.com/scroll-tech/da-codec/blob/main/encoding/codecv7_types.go#L20).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'The prover code can be found [here](https://github.com/scroll-tech/zkvm-prover/tree/master/crates/prover).',
      },
      {
        title: 'ZK Circuits',
        description:
          'Scroll circuits are [OpenVM](https://book.openvm.dev/)-based Guest Programs that use the OpenVM prover. The source code of the base circuits can be found [here](https://github.com/scroll-tech/zkvm-prover/tree/master/crates/circuits).',
      },
      {
        title: 'Verification Keys Generation',
        description:
          'SNARK verification keys can be generated and checked against Ethereum verifier contract using [this guide](https://github.com/scroll-tech/openvm/blob/66a8134a515c9f699d572e7f681311a04df3aef8/book/src/advanced-usage/sdk.md?plain=1#L99). The system requires a trusted setup.',
      },
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title:
              'ScrollChain.sol - Etherscan source code, verifyAggregateProof() and verifyBundleProof() calls',
            url: 'https://etherscan.io/address/0x0a20703878E68E587c59204cc0EA86098B8c3bA7#code',
          },
        ],
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
        {
          name: 'PlonkVerifierPostEuclid',
          description:
            'Scroll verifier proving bundles (group of batches). Corresponds to openvm zkVM Circuits (Euclid upgrade).',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x9F66505cB1626D06B50EF2597f41De6686e8f79a',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Main verifier',
              ...PROOFS.HALO2KZG('Powers of Tau 26'),
              link: 'https://github.com/scroll-tech/zkvm-prover/tree/master/crates/circuits',
            },
          ],
        },
      ],
    },
  },
  contracts: {
    addresses: {
      ...discovery.getDiscoveredContracts(),
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ...discovery.getDiscoveredPermissions(),
  },
  upgradesAndGovernance: `All core contracts in the Scroll protocol are upgradable by the \`ProxyAdmin\`, which is controlled by the Security Council through the \`ScrollOwner\` contract. The ScrollOwner is a central governance contract controlled by four distinct Timelocks: two governed by the Security Council multisig and two by the Scroll team multisigs. Each multisig can initiate specific types of changes with differing delay guarantees. The team has authority to revert unfinalized batches and add or remove sequencers and provers while sequencing is in permissioned mode. As the ScrollOwner admin, the Security Council can revert the team actions by revoking the team roles in the ScrollOwner contract (through the \`TimelockSCSlow\`) and upgrading the affected contracts. The Security Council can change parameters that affect L1->L2 messaging and the activation of permissionless sequencing (i.e., enforcedBatchMode), such as by calling the \`updateMessageQueueParameters\` and \`updateEnforcedBatchParameters\` functions or by pausing the \`EnforcedTXGateway\`. Emergency pause of core contracts is managed through the \`PauseController\`, which allows the team to pause batch commitment and finalization in permissioned mode, as well as L1->L2 messaging. Each pause is subject to a cooldown period of ${formatExecutionDelay(cooldownPeriod)}, during which the Security Council minority can unpause, while the Security Council majority is authorized to update and reset the cooldown period. SCR token holders perform onchain voting on governance proposals through the \`AgoraGovernor\` contract on L2. However, onchain governance proposals do not contain transaction payloads, so onchain voting only acts as an onchain temperature check. The Security Council is in charge of executing upgrades.`,
  milestones: [
    {
      title: 'Scroll Feynman upgrade',
      url: 'https://forum.scroll.io/t/proposal-feynman-upgrade/957',
      date: '2025-08-18T00:00:00Z',
      description:
        'Feynman upgrade to improve the fee model and EVM compatibility.',
      type: 'general',
    },
    {
      title: 'Emergency verifier upgrade',
      url: 'https://etherscan.io/tx/0x3367e24b6cb138cea321f4556259660f24aba1b79ccce8f798ed135e28905f17',
      date: '2025-08-09T00:00:00Z',
      description:
        'The SecurityCouncil emergency upgrades to fix a bug in the verifier.',
      type: 'incident',
    },
    {
      title: 'Access control upgrade',
      url: 'https://etherscan.io/tx/0x13c8a293bc6a367eb2510a2bd71cacefbe9705588a574696e790db820b3f520d',
      date: '2025-08-01T00:00:00Z',
      description:
        'Scroll Security Council upgrades permissions to regain Stage 1 status.',
      type: 'general',
    },
    {
      title: 'Emergency upgrade',
      url: 'https://forum.scroll.io/t/security-council-report-scroll-mainnet-emergency-upgrade-on-2025-05-26/810',
      date: '2025-05-26T00:00:00Z',
      description:
        'The SecurityCouncil emergency upgrades to fix a bug in the plonky3-based proof system.',
      type: 'incident',
    },
    {
      title: 'Scroll Euclid upgrade',
      url: 'https://scroll.io/blog/euclid-upgrade',
      date: '2025-04-24T00:00:00.00Z',
      description:
        'Scroll becomes Stage 1 by improving permissions and introducing enforced batch mode.',
      type: 'general',
    },
    {
      title: 'SCR token launch',
      url: 'https://scroll.io/blog/scr-token',
      date: '2024-10-19T00:00:00.00Z',
      description: 'Scroll launches its SCR token.',
      type: 'general',
    },
    {
      title: 'Batches reverted',
      url: 'https://status.scroll.io/incidents/44k6s4qg6kcs',
      date: '2024-07-05T00:00:00Z',
      description:
        'To fix a bug in the compression, 55 previously committed batches are reverted.',
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
  discoveryInfo: getDiscoveryInfo([discovery]),
}
