import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  STATE_ZKP_SN,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('scroll')

const timelockSlowDelay = discovery.getContractValue<number>(
  'TimelockSlow',
  'getMinDelay',
)
const timelockMidDelay = discovery.getContractValue<number>(
  'TimelockMid',
  'getMinDelay',
)
const timelockFastDelay = discovery.getContractValue<number>(
  'TimelockFast',
  'getMinDelay',
)

const upgradesScrollMultisig = {
  upgradableBy: ['ScrollMultisig'],
  upgradeDelay: 'No delay',
}

const isEnforcedTxGatewayPaused = discovery.getContractValue<boolean>(
  'EnforcedTxGateway',
  'paused',
)

const upgradeDelay = 0

export const scroll: Layer2 = {
  type: 'layer2',
  id: ProjectId('scroll'),
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
    activityDataSource: 'Blockchain RPC',
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

      finalizationPeriod: 0,
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
    explorerUrl: 'https://scrollscan.com/',
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
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9'),
        tokens: '*',
        ...upgradesScrollMultisig,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367'),
        tokens: ['ETH'],
        ...upgradesScrollMultisig,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xb2b10a289A229415a124EFDeF310C10cb004B6ff'),
        tokens: '*',
        ...upgradesScrollMultisig,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xf1AF3b23DE0A5Ca3CAb7261cb0061C0D779A5c7B'),
        tokens: ['USDC'],
        ...upgradesScrollMultisig,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6625C6332c9F91F2D27c304E729B86db87A3f504'),
        tokens: ['wstETH'],
        upgradableBy: ['Lido (Lido Agent)'],
        upgradeDelay: 'No delay',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc.scroll.io',
      defaultCallsPerMinute: 120,
      startBlock: 1,
    },
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
          sinceTimestampInclusive: new UnixTime(1696782323),
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
          sinceTimestampInclusive: new UnixTime(1714362335), // first blob tx: https://etherscan.io/tx/0x0c2b6063a92ab124c45ef518c12fe181a5728bb3a40015270493bd430ed400ea
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
          sinceTimestampInclusive: new UnixTime(1696782323),
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
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (blobs or calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'Transactions data',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...STATE_ZKP_SN,
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8#code',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8#code',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0xa13BAF47339d63B743e7Da8741db5456DAc1E556#code#F1#L154',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      sources: [
        {
          contract: 'L1MessageQueue',
          references: [
            'https://etherscan.io/address/0xeBaed7A81c298B24EE6d59c22698A951dc448E01#code',
          ],
        },
        {
          contract: 'EnforcedTxGateway',
          references: [
            'https://etherscan.io/address/0x642af405bF64660665B37977449C9C536B806318#code',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'ScrollChain',
          references: [
            'https://etherscan.io/address/0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8#code',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  technology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
    },
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'ScrollChain.sol - Etherscan source code, verifyAggregateProof() and verifyAggregateProof4844() calls',
          href: 'https://etherscan.io/address/0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8#code',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          text: 'ScrollChain.sol - Etherscan source, code commitBatch() function',
          href: 'https://etherscan.io/address/0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'ScrollChain.sol - Etherscan source code, finalizeBatchWithProof() function modifier',
          href: 'https://etherscan.io/address/0xaa6d0F2490AC3957B97e11afEC6F0f250593CaC8#code',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          text: 'EnforcedTxGateway.sol - Etherscan source code, EnforcedTxGateway is paused',
          href: 'https://etherscan.io/address/0x642af405bF64660665B37977449C9C536B806318#code',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            text: 'L1ETHGateway.sol - Etherscan source code, finalizeWithdrawETH function',
            href: 'https://etherscan.io/address/0x1fcbE079c4Bbab37406daB7Dfd35AcAe37D5C55d#code',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The node software to reconstruct the state is available [here](https://github.com/scroll-tech/go-ethereum). Note that it uses the L2 p2p network to fetch blocks, and not the L1 network. The consistency with L1 data can be checked by running the [scroll-geth node](https://github.com/scroll-tech/go-ethereum) with the `--rollup.verify` flag.',
    compressionScheme: 'The rollup does not use compression.',
    genesisState:
      'The genesis file can be found [here](https://scrollzkp.notion.site/genesis-json-f89ca24b123f462f98c8844d17bdbb74), which contains two prefunded addresses and five predeployed contracts.',
    dataFormat:
      'Blocks are grouped into chunks and chunks are grouped into batches. Chunk encoding format can be found [here](https://github.com/scroll-tech/scroll/blob/develop/contracts/src/libraries/codec/ChunkCodec.sol#L5), and batch encoding format can be found [here](https://github.com/scroll-tech/scroll/blob/develop/contracts/src/libraries/codec/BatchHeaderV0Codec.sol#L7).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'The prover code can be found [here](https://github.com/scroll-tech/scroll-prover).',
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
          name: 'ScrollVerifierV0',
          description:
            'Halo2 + KZG verifier using calldata for DA. Corresponds to version v0.9.5 of the circuits.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x585DfaD7bF4099E011D185E266907A8ab60DAD2D',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Final circuit',
              proofSystem: 'Halo2',
              mainArithmetization: 'Plonk',
              mainPCS: 'KZG',
              trustedSetup: 'Powers of Tau 26',
            },
            {
              name: 'Aggregation circuit',
              proofSystem: 'Halo2',
              mainArithmetization: 'Plonk',
              mainPCS: 'KZG',
              trustedSetup: 'Powers of Tau 26',
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.9.5/aggregator',
            },
            {
              name: 'Main circuit',
              proofSystem: 'Halo2',
              mainArithmetization: 'Plonk',
              mainPCS: 'KZG',
              trustedSetup: 'Powers of Tau 26',
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.9.5/zkevm-circuits',
            },
          ],
        },
        {
          name: 'ScrollVerifierV1',
          description:
            'Halo2 + KZG verifier using blobs for DA. Corresponds to version v0.10.3 of the circuits.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x4b289E4A5331bAFBc6cCb2F10C39B8EDceCDb247',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'ZkEvmVerifierV1',
              proofSystem: 'Halo2',
              mainArithmetization: 'Plonk',
              mainPCS: 'KZG',
              trustedSetup: 'Powers of Tau 26',
            },
            {
              name: 'RecursiveVerifier',
              proofSystem: 'Halo2',
              mainArithmetization: 'Plonk',
              mainPCS: 'KZG',
              trustedSetup: 'Powers of Tau 26',
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.3/zkevm-circuits',
            },
            {
              name: 'MainVerifier',
              proofSystem: 'Halo2',
              mainArithmetization: 'Plonk',
              mainPCS: 'KZG',
              trustedSetup: 'Powers of Tau 26',
              link: 'https://github.com/scroll-tech/zkevm-circuits/tree/v0.10.3/zkevm-circuits',
            },
          ],
        },
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('ScrollChain', {
        description:
          'The main contract of the Scroll chain. Allows to post transaction data and state roots, along with proofs. Sequencing and proposing are behind a whitelist. L1 -> L2 message processing on L2 is not enforced.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1ScrollMessenger', {
        description:
          'Contract used to send L1 -> L2 and relay messages from L2. It allows to replay failed messages and to drop skipped messages. L1 -> L2 messages sent using this contract pay for L2 gas on L1 and will have the aliased address of this contract as the sender.',
        ...upgradesScrollMultisig,
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
        )} timelock. Admin of the ScrollOwner contract, meaning it can assign and revoke roles. The ScrollMultisig can propose and cancel transactions, and the ExecutorMultisig can execute them.`,
      }),
      discovery.getContractDetails('TimelockMid', {
        description: `${formatSeconds(
          timelockMidDelay,
        )} timelock. Can manage the USDC gateway bridge. The ScrollMultisig can propose and cancel transactions, and the ExecutorMultisig can execute them.`,
      }),
      discovery.getContractDetails('TimelockFast', {
        description: `${formatSeconds(
          timelockFastDelay,
        )} timelock. Can add new sequencers and provers, update the gas oracle and permissions to update its values, the max gas limit, and gateways token mappings. The ScrollMultisig can propose and cancel transactions, and the ExecutorMultisig can execute them.`,
      }),
      discovery.getContractDetails('MultipleVersionRollupVerifier', {
        description:
          'Contract used to update the verifier and keep track of current and old versions.',
      }),
      discovery.getContractDetails('ZkEvmVerifierV0', {
        description:
          'Current verifier using calldata for DA, used to prepare data for the PlonkVerifier.',
      }),
      discovery.getContractDetails('ZkEvmVerifierV1', {
        description:
          'Current verifier using blobs for DA, used to prepare data for the PlonkVerifier.',
      }),
      discovery.getContractDetails('PlonkVerifierV0', {
        description:
          'Plonk verifier used to verify ZK proofs using calldata for DA.',
      }),
      discovery.getContractDetails('PlonkVerifierV1', {
        description:
          'Plonk verifier used to verify ZK proofs using blobs for DA.',
      }),
      discovery.getContractDetails('L1ETHGateway', {
        description: 'Contract used to bridge ETH from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1WETHGateway', {
        description: 'Contract used to bridge WETH from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1StandardERC20Gateway', {
        description:
          'Contract used to bridge ERC20 tokens from L1 to L2. It uses a fixed token list.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1CustomERC20Gateway', {
        description:
          'Contract used to bridge ERC20 tokens from L1 to L2. It allows to change the token mappings.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1USDCGateway', {
        description: 'Contract used to bridge USDC tokens from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1ERC721Gateway', {
        description: 'Contract used to bridge ERC721 tokens from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1ERC1155Gateway', {
        description: 'Contract used to bridge ERC1155 tokens from L1 to L2.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('L1GatewayRouter', {
        description:
          'Main entry point for depositing ETH and ERC20 tokens, which are then forwarded to the correct gateway.',
        ...upgradesScrollMultisig,
      }),
      discovery.getContractDetails('FeeVaultMultisig', {
        description:
          'Multisig used to store fees collected from gateways to pay for L1 -> L2 message execution.',
      }),
      discovery.getContractDetails('EnforcedTxGateway', {
        description:
          'Contracts to force L1 -> L2 messages with the proper sender.',
        ...upgradesScrollMultisig,
        pausable: {
          paused: isEnforcedTxGatewayPaused,
          pausableBy: ['ScrollOwner'],
        },
      }),
      discovery.getContractDetails('OLD_L2GasPriceOracle', {
        description:
          'Deprecated: the functionality of this contract has been moved to the L1MessageQueue contract. It was used to relay the L2 basefee on L1 in a trusted way using a whitelist. It was also used to store and update values related to intrinsic gas cost calculations.',
        ...upgradesScrollMultisig,
      }),
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'ScrollMultisig',
      'Currently also designated as the Security Council. Can upgrade proxies and the verifier without delay and propose transactions within Timelocks. It can also revert non finalized batches, remove sequencers and provers and pause contracts.',
    ),
    ...discovery.getMultisigPermission(
      'ExecutorMultisig',
      'Can execute timelock transactions.',
    ),
    ...discovery.getMultisigPermission(
      'EmergencyMultisig',
      'Can revert batches, remove sequencers and provers, and pause contracts.',
    ),
    {
      name: 'Sequencers',
      accounts: discovery.getPermissionedAccounts('ScrollChain', 'sequencers'),
      description: 'Actors allowed to commit transaction batches.',
    },
    {
      name: 'Proposers',
      accounts: discovery.getPermissionedAccounts('ScrollChain', 'provers'),
      description:
        'Actors allowed to prove transaction batches and publish state root updates.',
    },
  ],
  milestones: [
    {
      name: 'Bernoulli upgrade',
      link: 'https://scroll.io/blog/blobs-are-here-scrolls-bernoulli-upgrade',
      date: '2024-04-29T00:00:00.00Z',
      description:
        'Introduces EIP-4844 data blobs for L1 data availability, and the SHA2-256 precompile on L2.',
    },
    {
      name: 'Scroll official launch',
      link: 'https://x.com/Scroll_ZKP/status/1714286874020528554',
      date: '2023-10-17T00:00:00.00Z',
      description: 'Scroll announces its official launch.',
    },
    {
      name: 'Scroll Alpha testnet launch',
      link: 'https://scroll.io/blog/alphaTestnet',
      date: '2023-02-27T00:00:00.00Z',
      description: 'Scroll launches its Alpha testnet on Goerli.',
    },
  ],
}
