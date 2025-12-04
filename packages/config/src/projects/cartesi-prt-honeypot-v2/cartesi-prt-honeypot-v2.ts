import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  SOA,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('cartesi-prt-honeypot-v2')

const minChallengePeriodBlocks = discovery.getContractValue<number>(
  'CanonicalTournamentParametersProvider',
  'minChallengePeriodBlocks',
)
const minChallengePeriodSeconds = minChallengePeriodBlocks * 12
const topLevelTournamentBond = discovery.getContractValue<number>(
  'TopTournament_example',
  'bondValue',
)

export const cartesiprthoneypotv2: ScalingProject = {
  type: 'layer2',
  id: ProjectId('cartesi-prt-honeypot-v2'),
  capability: 'appchain',
  addedAt: UnixTime(1762783269), // 2025-11-10T14:01:09Z
  badges: [
    BADGES.VM.CartesiVM,
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Stack.Cartesi,
  ],
  display: {
    name: 'Cartesi PRT Honeypot v2',
    shortName: 'Honeypot v2',
    warning: 'The challenge protocol can be subject to delay attacks.',
    slug: 'cartesi-prt-honeypot-v2',
    stacks: ['Cartesi Rollups'],
    description:
      'Cartesi PRT Honeypot v2 is an application-specific Stage-2 rollup that stress-tests Cartesi Rollups’ security. Protected solely by Cartesi’s PRT (Permissionless Refereed Tournaments) fraud-proof algorithm, it turns its locked funds into an open bounty for anyone who can break the system. Users should not deposit unless they are willing to donate their funds to the Honeypot.',
    purposes: ['Bug bounty'],
    links: {
      websites: ['https://cartesi.io/'],
      documentation: [
        'https://docs.cartesi.io/cartesi-rollups/',
        'https://github.com/cartesi/honeypot/wiki/',
      ],
      explorers: ['https://cartesiscan.io/', 'https://explorer.cartesi.io/'],
      repositories: [
        'https://github.com/cartesi/honeypot',
        'https://github.com/cartesi/dave',
      ],
      socialMedia: [
        'https://twitter.com/cartesiproject',
        'https://discord.gg/G2tCH5KkcM',
        'https://cartesi.io/blog/',
        'https://reddit.com/r/cartesi/',
        'https://youtube.com/@cartesiproject',
        'https://t.me/cartesiproject',
        'https://linkedin.com/company/cartesiproject',
        'https://instagram.com/cartesiproject/',
        'https://medium.com/cartesi',
      ],
    },
    liveness: {
      warnings: {
        stateUpdates:
          'The current PRT implementation is vulnerable to Sybil attacks that may impact settlement liveness. Safety and decentralization are unaffected.',
      },
      explanation:
        'The current PRT implementation uses three tournament levels, which creates liveness risks in the event of Sybil attacks. As a result, a well-funded adversary can create Sybil challengers to keep the dispute tree alive, delaying settlement. Safety and decentralization are unaffected, but withdrawals can be significantly delayed until every branch is resolved.',
    },
  },
  proofSystem: {
    type: 'Optimistic',
    name: 'Dave',
    challengeProtocol: 'Interactive',
  },
  scopeOfAssessment: {
    inScope: [
      'Ability to deposit and withdraw CTSI by the permissioned address',
      SOA.l1Contracts,
      SOA.derivationSpec,
      'Permissioned Withdrawal logic in the offchain application',
    ],
    notInScope: [
      'Published offchain Cartesi Machine source code',
      'Cartesi Machine source code to onchain template hash mapping',
    ],
  },
  config: {
    associatedTokens: ['CTSI'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xfddf68726a28e418fa0c2a52c3134904a8c3e998',
        ),
        tokens: '*',
        description: 'Contract storing bounty funds.',
      }),
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac',
          ),
          selector: '0x1789cd63',
          functionSignature:
            'function addInput(address appContract, bytes payload) returns (bytes32)',
          sinceTimestamp: UnixTime(1762263971),
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
            '0xF0D8374F8446E87e013Ec1435C7245E05f439259',
          ),
          selector: '0x8bca2e0c',
          functionSignature:
            'function settle(uint256 epochNumber, bytes32 outputsMerkleRoot, bytes32[] calldata proof)',
          sinceTimestamp: UnixTime(1762263971),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT(minChallengePeriodSeconds),
      initialBond: utils.formatEther(topLevelTournamentBond),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: {
      value: 'Not applicable',
      description:
        'Users cannot exit their funds as all deposits are considered donations.',
      sentiment: 'neutral',
      orderHint: Number.NEGATIVE_INFINITY,
      warning: {
        value:
          'Bug bounty Appchain: The single hardcoded address can withdraw all funds.',
        sentiment: 'bad',
      },
    },
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER,
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: null,
        usersCanExitWithoutCooperation: null,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: null,
      },
    },
    {
      rollupNodeLink:
        'https://github.com/cartesi/dave/tree/main/cartesi-rollups/node',
      additionalConsiderations: {
        short:
          'The Cartesi PRT Honeypot v2 is a minimal appchain (running a Cartesi Machine / dApp) for the purpose of incentivizing the testing of the Cartesi PRT proof system. Inputs/actions in the appchain are limited to deposits of CTSI by anyone and withdrawals by a single user.',
        long: 'Users can deposit (donate) CTSI tokens to the Honeypot. The funds can only be withdrawn by the Cartesi Multisig to its own address. The appchain has the very specific purpose of a bug bounty on the proof system, incentivizing security researchers to break it and claim the deposited funds.',
      },
    },
  ),
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          title: 'InputBox.sol#18 - Etherscan source code, addInput function',
          url: 'https://etherscan.io/address/0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac#code#F1#L18',
        },
      ],
    },
    operator: {
      ...OPERATOR.DECENTRALIZED_OPERATOR,
      references: [
        {
          title: 'Honeypot Docs - Running a validator node',
          url: 'https://github.com/cartesi/honeypot/wiki/Running-a-validator-node',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [],
    },
    exitMechanisms: [
      {
        name: 'No user withdrawals',
        description: `No address apart from the Cartesi Multisig can trigger a withdrawal and deposits are considered donations to the Honeypot. If a withdrawal is requested by them, all funds in the escrow are withdrawable to the permissioned address as soon as the next settlement on L1 occurs (min. every ${formatSeconds(minChallengePeriodSeconds)}).`,
        risks: [],
        references: [
          {
            title: 'Requesting withdrawals, Honeypot Wiki',
            url: 'https://github.com/cartesi/honeypot/wiki/Requesting-withdrawals',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The source code for the Cartesi node software is available [here](https://github.com/cartesi/dave/tree/v2.0.0/cartesi-rollups/node).',
    genesisState:
      'The genesis state comes from the Honeypot Cartesi Machine template included in the [Honeypot v3 release](https://github.com/cartesi/honeypot/releases/tag/v3.0.0). Alternatively, you can recreate it by following the build steps in the [Honeypot GitHub Repository](https://github.com/cartesi/honeypot/tree/v3.0.0?tab=readme-ov-file#building-the-application).',
    dataFormat:
      'The reference implementation for ERC20 deposits can be found [here](https://github.com/cartesi/rollups-contracts/blob/v2.1.0/src/common/InputEncoding.sol#L38). To learn about the withdrawal request format, please refer to the documentation [here](https://github.com/cartesi/honeypot/wiki/Requesting-withdrawals).',
  },
  stateValidation: {
    isUnderReview: true,
    categories: [
      {
        ...STATE_VALIDATION.FRAUD_PROOFS,
        description:
          STATE_VALIDATION.FRAUD_PROOFS.description +
          `The initial bond for joining the tournament is set to ${utils.formatEther(
            topLevelTournamentBond,
          )} ETH.`,
        references: [
          {
            title: 'Permissionless Refereed Tournaments',
            url: 'https://arxiv.org/abs/2212.12439',
          },
          {
            title:
              'MultiLevelTournamentFactory.sol#L48 - dispute resolution factory',
            url: 'https://etherscan.io/address/0xa02997f69Dc5F1A727abE12ee36f87E28BBdEa6b#code#F1#L48',
          },
          {
            title: 'DaveConsensus.sol#L111 - application consensus',
            url: 'https://etherscan.io/address/0xF0D8374F8446E87e013Ec1435C7245E05f439259#code#F1#L111',
          },
        ],
      },
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
  milestones: [
    {
      title: 'Permissionless Refereed Tournaments',
      url: 'https://arxiv.org/abs/2212.12439',
      date: '2022-12-23T00:00:00Z',
      description: 'PRT paper published on arxiv.',
      type: 'general',
    },
    {
      title: 'The Dave Algorithm',
      url: 'https://youtu.be/dI_3neyXVl0',
      date: '2024-11-13T00:00:00Z',
      description: 'Devcon 2024 presentation introducing the Dave algorithm.',
      type: 'general',
    },
    {
      title: 'Dave: decentralized, secure, lively fraud-proofs',
      url: 'https://dl.acm.org/doi/10.1145/3734698',
      date: '2025-05-09T00:00:00Z',
      description: 'Dave paper published on ACM DLT, a peer-reviewed journal.',
      type: 'general',
    },
    {
      title: 'Cartesi PRT Honeypot v2 deployed on Ethereum',
      url: 'https://etherscan.io/address/0xfddf68726a28e418fa0c2a52c3134904a8c3e998',
      date: '2025-11-08T00:00:00Z',
      description: 'Cartesi PRT Honeypot v2 deployed to Ethereum mainnet.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
