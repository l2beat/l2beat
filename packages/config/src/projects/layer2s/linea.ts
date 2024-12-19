import {
  assert,
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { Badge } from '../badges'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
  STATE_CORRECTNESS,
  ScalingProjectPermissionedAccount,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ESCROW } from '../../common/escrow'
import { formatExecutionDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { PERFORMED_BY } from '../zk-catalog/common/performedBy'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('linea')

const timelockDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)
const timelockDelayString = formatSeconds(timelockDelay)

const upgradesTimelock = {
  upgradableBy: ['LineaAdminMultisig'],
  upgradeDelay: timelockDelay === 0 ? 'No delay' : timelockDelayString,
}

const upgrades = {
  upgradableBy: ['LineaAdminMultisig'],
  upgradeDelay: 'No delay',
}

const zodiacRoles = discovery.getContractValue<{
  roles: Record<string, Record<string, boolean>>
}>('Roles', 'roles')
const zodiacPauserRole = '1'
const zodiacPausers: ScalingProjectPermissionedAccount[] = Object.keys(
  zodiacRoles.roles[zodiacPauserRole].members,
).map((zodiacPauser) => discovery.formatPermissionedAccount(zodiacPauser))

const isPaused: boolean =
  discovery.getContractValue<boolean>('LineaRollup', 'isPaused_GENERAL') ||
  discovery.getContractValue<boolean>('LineaRollup', 'isPaused_FINALIZATION') ||
  discovery.getContractValue<boolean>(
    'LineaRollup',
    'isPaused_BLOB_SUBMISSION',
  ) ||
  discovery.getContractValue<boolean>(
    'LineaRollup',
    'isPaused_CALLDATA_SUBMISSION',
  ) ||
  discovery.getContractValue<boolean>(
    'LineaRollup',
    'isPaused_COMPLETE_TOKEN_BRIDGING',
  ) ||
  discovery.getContractValue<boolean>(
    'LineaRollup',
    'isPaused_INITIATE_TOKEN_BRIDGING',
  ) ||
  discovery.getContractValue<boolean>('LineaRollup', 'isPaused_L1_L2') ||
  discovery.getContractValue<boolean>('LineaRollup', 'isPaused_L2_L1')

const periodInSeconds = discovery.getContractValue<number>(
  'LineaRollup',
  'periodInSeconds',
)

const withdrawalLimitInWei = discovery.getContractValue<number>(
  'LineaRollup',
  'limitInWei',
)

const finalizationPeriod = 0

const withdrawalLimitString = `Currently, there is a general limit of ${utils.formatEther(
  withdrawalLimitInWei,
)} ETH that can be withdrawn within each ${formatSeconds(
  periodInSeconds,
)} time window.`

export const linea: Layer2 = {
  type: 'layer2',
  id: ProjectId('linea'),
  createdAt: new UnixTime(1679651674), // 2023-03-24T09:54:34Z
  display: {
    name: 'Linea',
    slug: 'linea',
    warning: 'The circuit of the program being proven is not public.',
    description:
      'Linea is a ZK Rollup powered by a zkEVM developed at Consensys, designed to scale the Ethereum network.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
    links: {
      websites: ['https://linea.build/'],
      apps: ['https://bridge.linea.build/'],
      documentation: ['https://docs.linea.build/'],
      explorers: [
        'https://lineascan.build/',
        'https://explorer.linea.build/',
        'https://linea.l2scan.co/',
      ],
      repositories: [
        'https://github.com/Consensys?q=linea&type=all&language=&sort=stargazers',
      ],
      socialMedia: [
        'https://twitter.com/LineaBuild',
        'https://discord.gg/linea',
        'https://linea.mirror.xyz/',
        'https://community.linea.build/',
      ],
      rollupCodes: 'https://rollup.codes/linea',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation:
        'Linea is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. Proofs and state roots are currently posted in the same transaction.',
    },
    finality: {
      finalizationPeriod,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xd19d4B5d358258f05D7B411E21A1460D11B0876F'),
        sinceTimestamp: new UnixTime(1689159923),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x504A330327A089d8364C4ab3811Ee26976d388ce'),
        sinceTimestamp: new UnixTime(1691079071),
        ...ESCROW.CANONICAL_EXTERNAL,
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319'),
        sinceTimestamp: new UnixTime(1691060675),
        excludedTokens: ['rsETH'],
        tokens: '*',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://linea-mainnet.infura.io/v3',
      startBlock: 1,
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x7a776315',
          functionSignature:
            'function submitData((bytes32,bytes32,bytes32,uint256,uint256,bytes32,bytes))',
          sinceTimestamp: new UnixTime(1707831168),
          untilTimestamp: new UnixTime(1711469339),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x2d3c12e5',
          functionSignature:
            'function submitBlobData(tuple(bytes32,bytes32,bytes32,uint256,uint256,bytes32),uint256,bytes,bytes)',
          // first tx with blobs
          // https://etherscan.io/tx/0x4d03b7e1950256de257ff95b52fac047faeb11600c5975abe7e0ccbc7be7ecfb
          sinceTimestamp: new UnixTime(1711449407),
          untilTimestamp: new UnixTime(1717588271),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x42fbe842',
          functionSignature:
            'function submitBlobs(((bytes32,uint256,uint256,bytes32),uint256,bytes,bytes)[], bytes32, bytes32)',
          // first tx with blobs
          // https://etherscan.io/tx/0x88bca59bc9581b15b39379e5c68a6d0e4847eae04185c838f1c48c9b67abf87a
          sinceTimestamp: new UnixTime(1717588271),
          untilTimestamp: new UnixTime(1734357131),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x6854f6bc',
          functionSignature:
            'function submitDataAsCalldata(tuple(bytes32 finalStateRootHash, bytes32 snarkHash, bytes compressedData) _submission, bytes32 _parentShnarf, bytes32 _expectedShnarf)',
          sinceTimestamp: new UnixTime(1734357131),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x99467a35',
          functionSignature:
            'function submitBlobs(tuple(uint256 dataEvaluationClaim, bytes kzgCommitment, bytes kzgProof, bytes32 finalStateRootHash, bytes32 snarkHash)[] _blobSubmissions, bytes32 _parentShnarf, bytes32 _finalBlobShnarf)',
          // upgrade tx
          // https://etherscan.io/tx/0x96b88112de2e594cb763bc625cc2dcb6920825bb642eb1a62ff577f0c29f616d
          sinceTimestamp: new UnixTime(1734357131),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x4165d6dd',
          functionSignature:
            'function finalizeBlocks((bytes32, uint32, bytes[], bytes32[], bytes, uint16[])[] _blocksData,bytes _proof,uint256 _proofType,bytes32 _parentStateRootHash)',
          sinceTimestamp: new UnixTime(1689159923),
          untilTimestamp: new UnixTime(1707831168),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0xd630280f',
          functionSignature:
            'function finalizeCompressedBlocksWithProof(bytes,uint256,(bytes32,bytes32[],bytes32,uint256,uint256,uint256,bytes32,uint256,bytes32[],uint256,bytes))',
          sinceTimestamp: new UnixTime(1707831168),
          untilTimestamp: new UnixTime(1717508999),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0xabffac32',
          functionSignature:
            'function finalizeBlocksWithProof(bytes,uint256,(bytes32,bytes32,uint256,(bytes32,bytes32,bytes32,bytes32,bytes32),uint256,uint256,bytes32,bytes32,uint256,uint256,uint256,bytes32[],bytes))',
          sinceTimestamp: new UnixTime(1717508999),
          untilTimestamp: new UnixTime(1734357131),
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
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x5603c65f',
          functionSignature:
            'function finalizeBlocks(bytes _aggregatedProof, uint256 _proofType, tuple(bytes32 parentStateRootHash, uint256 endBlockNumber, tuple(bytes32 parentShnarf, bytes32 snarkHash, bytes32 finalStateRootHash, bytes32 dataEvaluationPoint, bytes32 dataEvaluationClaim) shnarfData, uint256 lastFinalizedTimestamp, uint256 finalTimestamp, bytes32 lastFinalizedL1RollingHash, bytes32 l1RollingHash, uint256 lastFinalizedL1RollingHashMessageNumber, uint256 l1RollingHashMessageNumber, uint256 l2MerkleTreesDepth, bytes32[] l2MerkleRoots, bytes l2MessagingBlocksOffsets) _finalizationData)',
          sinceTimestamp: new UnixTime(1734357131),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
    // finality: { // fn sigs changed in the alpha v4 upgrade, and the finality analyzer would only work with blob data (basti has a working branch)
    //   type: 'Linea',
    //   lag: 0,
    //   minTimestamp: new UnixTime(1717588271),
    //   stateUpdate: 'disabled',
    // },
  },
  chainConfig: {
    name: 'linea',
    chainId: 59144,
    blockscoutV2ApiUrl: 'https://api-explorer.linea.build/api/v2',
    explorerUrl: 'https://lineascan.build',
    explorerApi: {
      url: 'https://api.lineascan.build/api',
      type: 'etherscan',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-07-19T14:00:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 42,
        version: '3',
      },
    ],
    coingeckoPlatform: 'linea',
  },
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.ETH_BLOBS_OR_CALLDATA],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    }),
  ],
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      secondLine: formatExecutionDelay(finalizationPeriod),
      sources: [
        {
          contract: 'LineaRollup',
          references: [
            'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      description:
        RISK_VIEW.DATA_ON_CHAIN.description +
        ' Unlike most ZK rollups, transaction data is posted instead of state diffs.',
      sources: [
        {
          contract: 'LineaRollup',
          references: [
            'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(timelockDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      description:
        RISK_VIEW.SEQUENCER_NO_MECHANISM().description +
        ' Eventually (after 6 months of no finalized blocks) the Operator role becomes public, theoretically allowing anyone to post data.',
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      description:
        RISK_VIEW.PROPOSER_CANNOT_WITHDRAW.description +
        ' Eventually (after 6 months of no finalized blocks) the Operator role becomes public, theoretically allowing anyone to propose state with valid proofs.',
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
      securityCouncilProperlySetUp: [
        false,
        'Security Council members are not publicly known.',
      ],
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
    },
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          text: 'LineaRollup.sol - Etherscan source code, submitBlobs() function',
          href: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
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
          text: 'LineaRollup.sol - Etherscan source code, onlyRole(OPERATOR_ROLE) modifier',
          href: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
        },
      ],
    },
    forceTransactions: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        description:
          EXITS.REGULAR('zk', 'merkle proof').description +
          ' Note that withdrawal requests can be censored by the Sequencer. ' +
          withdrawalLimitString +
          ' Users can (eventually, after 6 months of inactivity from the centralized Operator) exit by replacing the Operator. In such a case they need to self-propose and prove their new state on the base layer with the required software which is currently not made available.',
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            text: 'L1MessageService.sol - Etherscan source code, claimMessageWithProof() function',
            href: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
          },
          {
            text: 'LineaRollup.sol - Etherscan source code, setFallbackOperator() function',
            href: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code#F1#L212',
          },
        ],
      },
    ],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'LineaAdminMultisig',
      'Admin of the Linea rollup. Can upgrade all core contracts, bridges and update permissioned actors.',
    ),
    {
      accounts: zodiacPausers,
      name: 'Pauser',
      description:
        'Address allowed to pause the TokenBridge, the USDCBridge and the core functionalities of the project (via LineaRollup contract).',
    },
    {
      accounts: discovery.getAccessControlRolePermission(
        'LineaRollup',
        'OPERATOR_ROLE',
      ),
      name: 'Operators',
      description:
        'The operators are allowed to prove blocks and post the corresponding transaction data.',
    },
    {
      accounts: zodiacPausers,
      name: 'Pauser',
      description:
        'Address allowed to pause the ERC20Bridge, the USDCBridge and the core functionalities of the project in the LineaRollup contract (via the Roles module of the LineaAdminMultisig).',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('LineaRollup', {
        description:
          'The main contract of the Linea zkEVM rollup. Contains state roots, the verifier addresses and manages messages between L1 and the L2.',
        ...upgradesTimelock,
        pausable: (() => {
          const addresses = discovery.getAccessControlField(
            'LineaRollup',
            'PAUSE_MANAGER',
          ).members
          assert(addresses.length === 1)
          assert(
            addresses[0] ===
              discovery.getContract('LineaAdminMultisig').address,
          )
          return { pausableBy: ['LineaAdminMultisig'], paused: isPaused }
        })(),
        references: [
          {
            text: 'LineaRollup.sol - Etherscan source code, state injections: stateRoot and l2MerkleRoot are part of the validity proof input.',
            href: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
          },
        ],
        ...upgradesTimelock,
      }),
      discovery.getContractDetails(
        'Timelock',
        `Owner of the ProxyAdmin and Verifier Setter. The current delay is ${timelockDelayString}.`,
      ),
      discovery.getContractDetails('VerifierProofType3', {
        description:
          'Currently used smart contract verifying the proofs for the Linea zkEVM.',
      }),
      discovery.getContractDetails('TokenBridge', {
        description: 'Contract used to bridge ERC20 tokens.',
        ...upgrades,
      }),
      discovery.getContractDetails('USDCBridge', {
        description: 'Contract used to bridge USDC tokens.',
        ...upgrades,
      }),
      discovery.getContractDetails('CallForwardingProxy', {
        description:
          'A proxy contract forwarding calls to a predefined (immutable) target contract. In this case the it is targeting the LineaRollup where it is registered as a fallback operator, allowing anyone to access operator functions when 6 months have passed since the latest finalized block.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(timelockDelayString)],
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description: 'The source code of the prover is currently not public.',
      },
      {
        title: 'ZK Circuits',
        description: 'The source code of the circuits is currently not public.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the proof system is implemented incorrectly.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the prover is able to generate false proofs.',
          },
        ],
      },
      {
        title: 'Verification Keys Generation',
        description:
          'Given that the circuit is not public, the generation of the verification keys is not public either.',
      },
    ],
    proofVerification: {
      shortDescription: 'Linea is a universal ZK-EVM rollup on Ethereum.',
      aggregation: false,
      requiredTools: [],
      verifiers: [
        {
          name: 'LineaVerifier (ProofType 1)',
          description:
            'The smart contract verifying the computational integrity of the Linea zkEVM. Since the circuit behind it is not public, we are not able to verify any claim about the proof system.',
          verified: 'failed',
          performedBy: PERFORMED_BY.l2beat,
          contractAddress: EthereumAddress(
            '0x8AB455030E1Ea718e445f423Bb8D993dcAd24Cc4',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Main circuit',
              proofSystem: '?',
              mainArithmetization: '?',
              mainPCS: '?',
            },
          ],
        },
        {
          name: 'LineaVerifier (ProofType 3)',
          description:
            'The smart contract verifying the computational integrity of the Linea zkEVM. Since the circuit behind it is not public, we are not able to verify any claim about the proof system.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0xBfF4a03A355eEF7dA720bBC7878F9BdBBE81fe6F',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Main circuit',
              proofSystem: '?',
              mainArithmetization: '?',
              mainPCS: '?',
            },
          ],
        },
      ],
    },
  },
  milestones: [
    {
      name: 'Linea starts using blobs',
      link: 'https://twitter.com/LineaBuild/status/1772711269159567483',
      date: '2024-03-26T00:00:00Z',
      description: 'Linea starts publishing data to blobs.',
      type: 'general',
    },
    {
      name: 'Alpha v2 is released',
      date: '2024-02-13',
      description: 'This release reduces L1 costs and fees for users.',
      link: 'https://docs.linea.build/build-on-linea/linea-version#alpha-v2-release-notes',
      type: 'general',
    },
    {
      name: 'Open Testnet is Live',
      date: '2023-03-28',
      description:
        'Linea has launched on the Goerli testnet, allowing users and developers to test the platform.',
      link: 'https://linea.mirror.xyz/6G30hwV2wPs_wPv0VEgHYaIdghMkIQaad-OI_0br1hM',
      type: 'general',
    },
    {
      name: 'Mainnet Alpha Launch',
      date: '2023-07-12',
      description: 'Linea has launched on the Ethereum mainnet.',
      link: 'https://linea.mirror.xyz/7l9gKzYzKVOxEOnReavov467Ss_fsrkGzABvbRISPMY',
      type: 'general',
    },
  ],
  badges: [Badge.VM.EVM, Badge.DA.EthereumBlobs, Badge.Other.L3HostChain],
}
