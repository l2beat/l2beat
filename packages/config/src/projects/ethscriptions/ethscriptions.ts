import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  DATA_ON_CHAIN,
  EXITS,
  OPERATOR,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ZK_PROGRAM_HASHES } from '../../common/zkProgramHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('ethscriptions')

const FALLBACK_TIMEOUT_SECS = discovery.getContractValue<number>(
  'Rollup',
  'FALLBACK_TIMEOUT_SECS',
)

const MAX_CHALLENGE_SECS = discovery.getContractValue<number>(
  'Rollup',
  'MAX_CHALLENGE_SECS',
)

const proposerBond = discovery.getContractValue<number>(
  'Rollup',
  'PROPOSER_BOND',
)

const ethscriptionsProgramHashes = []
ethscriptionsProgramHashes.push(
  discovery.getContractValue<string>('Rollup', 'AGG_VKEY'),
)
ethscriptionsProgramHashes.push(
  discovery.getContractValue<string>('Rollup', 'RANGE_VKEY_COMMITMENT'),
)

export const ethscriptions: ScalingProject = {
  type: 'layer2',
  id: ProjectId('ethscriptions'),
  capability: 'appchain',
  addedAt: UnixTime(1736331600), // 2025-01-08
  badges: [
    BADGES.VM.AppChain,
    BADGES.Fork.FacetFork,
    BADGES.Other.BasedSequencing,
    BADGES.DA.EthereumCalldata,
    BADGES.VM.EVM,
  ],
  scopeOfAssessment: {
    inScope: [
      'Sequencing mechanism via L1 derivation pipeline and state validation mechanism via the Rollup proof system',
      'Upgradability of the Rollup contract',
    ],
    notInScope: [
      'Bridge functionality - the system intentionally has no canonical bridge. Native gas tokens are minted algorithmically from L1 gas burn rather than through a bridge escrow',
      'The soundness of the ZK proof system of Rollup',
    ],
  },
  proofSystem: {
    type: 'Optimistic',
    zkCatalogId: ProjectId('sp1'),
    challengeProtocol: 'Single-step',
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
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: true,
      },
    },
    {
      rollupNodeLink:
        'https://github.com/ethscriptions-protocol/ethscriptions-node',
    },
  ),
  discoveryInfo: getDiscoveryInfo([discovery]),
  display: {
    name: 'Ethscriptions',
    slug: 'ethscriptions',
    description:
      'Ethscriptions is a based rollup that provides cryptographic state and EVM compatibility for ethscriptions. It uses a derivation pipeline to convert L1 ethscription activity into canonical L2 blocks.',
    purposes: ['NFT'],
    links: {
      websites: ['https://ethscriptions.com/'],
      bridges: [],
      documentation: ['https://docs.ethscriptions.com/'],
      explorers: ['https://explorer.ethscriptions.com/'],
      repositories: [
        'https://github.com/ethscriptions-protocol/ethscriptions-node',
        'https://github.com/ethscriptions-protocol/ethscriptions-geth',
        'https://github.com/0xFacet/ethscriptions-zk-fault-proofs',
      ],
      socialMedia: ['https://x.com/ethscriptions'],
    },
  },
  config: {
    escrows: [],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xC437f0AbaF358Ac1baEFD7f9402Bb8839C1e795A',
          ),
          selector: '0x45925013',
          functionSignature:
            'function submitProposal(bytes32 root, uint256 l2BlockNumber, uint256 parentId) payable returns (uint256 proposalId)',
          sinceTimestamp: UnixTime(1767735587),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xC437f0AbaF358Ac1baEFD7f9402Bb8839C1e795A',
          ),
          selector: '0x9eeeb214',
          functionSignature:
            'function proveBlock(uint256 l2BlockNumber, bytes32 root, uint256 l1BlockNumber, bytes proof)',
          sinceTimestamp: UnixTime(1767735587),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xC437f0AbaF358Ac1baEFD7f9402Bb8839C1e795A',
          ),
          selector: '0x0075552a',
          functionSignature:
            'function proveProposal(uint256 id, uint256 l1BlockNumber, bytes proof)',
          sinceTimestamp: UnixTime(1767735587),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xC437f0AbaF358Ac1baEFD7f9402Bb8839C1e795A',
          ),
          selector: '0x0062804e',
          functionSignature: 'function resolveProposal(uint256 id)',
          sinceTimestamp: UnixTime(1767735587),
        },
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
      adjustCount: { type: 'SubtractOne' },
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_OPTIMISTIC,
      challengeDelay: MAX_CHALLENGE_SECS,
      executionDelay: 0,
      initialBond: formatEther(proposerBond),
    },
    dataAvailability: {
      ...DATA_ON_CHAIN,
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER,
    },
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_MAX_DELAY(
      FALLBACK_TIMEOUT_SECS,
    ),
  },
  technology: {
    operator: OPERATOR.DECENTRALIZED_OPERATOR,
    forceTransactions: {
      name: 'Users can force any transaction',
      description:
        'Because the system derives L2 state from all valid ethscription transactions on Ethereum L1, users can circumvent censorship by submitting any transaction with valid Data URI calldata. There is no specific inbox address required.',
      risks: [],
      references: [],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('optimistic', MAX_CHALLENGE_SECS),
        description:
          EXITS.REGULAR_MESSAGING('optimistic', MAX_CHALLENGE_SECS)
            .description +
          ' The challenge period can be shortened if the block is proven by providing a ZK proof.',
      },
    ],
    sequencing: {
      name: 'Based Sequencing',
      description:
        'Ethscriptions uses a based sequencing model where transaction ordering is determined entirely by Ethereum L1. Unlike traditional rollups, Ethscriptions does not use a batch inbox. Instead, it derives L2 blocks directly from L1 receipts and logs by monitoring all Ethereum transactions for valid Data URI calldata (ethscription creations) and ESIP protocol events (transfers). L2 blocks preserve the exact order in which Ethereum includes these transactions.',
      risks: [],
      references: [
        {
          title: 'Ethscriptions Kona - GitHub',
          url: 'https://github.com/ethscriptions-protocol/ethscriptions-kona',
        },
      ],
    },
    otherConsiderations: [
      {
        name: 'Derivation Pipeline',
        description:
          'The Ethscriptions AppChain operates as a derivation pipeline that converts L1 ethscription activity into canonical L2 blocks. A Ruby-based derivation node observes L1 blocks, parses ethscription intents from calldata and events, and constructs deposit-style EVM transactions. These are then executed by a modified geth implementation (ethscriptions-geth) that maintains EVM state and provides standard JSON-RPC interface.',
        risks: [],
        references: [
          {
            title: 'Ethscriptions Node - GitHub',
            url: 'https://github.com/ethscriptions-protocol/ethscriptions-node',
          },
          {
            title: 'Ethscriptions Geth - GitHub',
            url: 'https://github.com/ethscriptions-protocol/ethscriptions-geth',
          },
        ],
      },
    ],
  },
  stateValidation: {
    description:
      'Ethscriptions implements a dual-track proving system that combines optimistic proposals with bonds with ZK validity proofs. The system allows bypassing the 7-day fraud proof window by providing a ZK proof.',
    categories: [
      {
        title: 'Challenges',
        description:
          'The system operates on two parallel tracks: an optimistic track where whitelisted proposers submit state roots with ETH bonds that can be challenged within a time window, and a validity-proof track where anyone can submit direct ZK proofs for immediate resolution. Validity proofs bypass the optimistic flow and can invalidate multiple incorrect optimistic proposals simultaneously targeting the same state root. When optimistic proposals are challenged, proposers must defend their claims by providing ZK proofs within the proving window.',
      },
      {
        title: 'Validity proofs',
        description:
          "The system uses Succinct's SP1 zkVM and Prover Network to generate zero-knowledge proofs that verify L2 state transitions. Anyone can submit a validity proof through the proveBlock() function of the Rollup contract to bypass the optimistic flow and settle an anchor block. Submitting a validity proof during a challenge settles the dispute in a single transaction.",
        references: [
          {
            title: 'Ethscriptions ZK Fault Proofs - GitHub Repository',
            url: 'https://github.com/0xFacet/ethscriptions-zk-fault-proofs',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [],
    zkProgramHashes: ethscriptionsProgramHashes.map((el) =>
      ZK_PROGRAM_HASHES(el),
    ),
  },
  permissions: discovery.getDiscoveredPermissions(),
  chainConfig: {
    name: 'ethscriptions',
    chainId: 61166, // 0xeeee
    gasTokens: ['ETH'],
    explorerUrl: 'https://explorer.ethscriptions.com',
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.ethscriptions.com/',
        callsPerMinute: 300,
      },
    ],
  },
  milestones: [
    {
      title: 'Rollup contract deployed',
      url: 'https://etherscan.io/address/0xC437f0AbaF358Ac1baEFD7f9402Bb8839C1e795A',
      date: '2025-01-06T00:00:00Z',
      type: 'general',
      description:
        'Ethscriptions deploys its rollup contract with SP1 ZK fault proofs on Ethereum mainnet.',
    },
  ],
}
