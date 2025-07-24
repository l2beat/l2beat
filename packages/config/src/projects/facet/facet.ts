import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DATA_ON_CHAIN,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatExecutionDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('facet')
const l2Discovery = new ProjectDiscovery('facet', 'facet')

const FALLBACK_TIMEOUT_SECS = discovery.getContractValue<number>(
  'Rollup',
  'FALLBACK_TIMEOUT_SECS',
)

const MAX_CHALLENGE_SECS = discovery.getContractValue<number>(
  'Rollup',
  'MAX_CHALLENGE_SECS',
)

export const facet: ScalingProject = {
  type: 'layer2',
  id: ProjectId('facet'),
  capability: 'universal',
  addedAt: UnixTime(1735889012), // 2025-01-03T01:36:52Z
  badges: [
    BADGES.Other.BasedSequencing,
    BADGES.DA.EthereumCalldata,
    BADGES.VM.EVM,
    BADGES.Stack.OPStack,
  ],
  scopeOfAssessment: {
    inScope: [
      'Ability to deposit, spend, and withdraw ETH from the selected bridge (L1ETHBridge) built on top of Rollup.',
      'Sequencing mechanism via L1 through the Inbox and state validation mechanism via the Rollup proof system',
      'Upgradability of contracts including the selected bridge (L1ETHBridge)',
    ],
    notInScope: [
      'Ability to deposit, spend, and withdraw ETH from any bridge other than the selected bridge (L1ETHBridge)',
      'Bridged token compatibility with other DeFi applications e.g., Facet Fun Bucks (FFB)',
      'The soundness of the ZK proof system of Rollup',
      'Upgradability of the external bridge contracts including the fast bridge (FacetEtherBridgeV6)',
    ],
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
      rollupNodeLink: 'https://github.com/0xFacet/facet-op-succinct',
    },
  ),
  discoveryInfo: getDiscoveryInfo([discovery]),
  display: {
    name: 'Facet',
    slug: 'facet',
    description:
      'Facet is a based rollup built on OP-Succinct. It uses FCT as its native gas token, which is mintable by spending gas on L1.',
    headerWarning:
      'Multiple bridges: As the Facet team does not designate a canonical bridge and no gas token bridge is used, for the purposes of this risk analysis the canonical bridge was arbitrarily selected by the L2BEAT team. There are multiple bridges to Facet that introduce additional trust assumptions, such as the FacetEtherBridgeV6 fast bridge that relies on a permissioned EOA as operator for withdrawal processing.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://facet.org/'],
      bridges: ['https://facetswap.com/bridge'],
      documentation: ['https://docs.facet.org/'],
      explorers: ['https://explorer.facet.org/'],
      repositories: ['https://github.com/0xFacet'],
      socialMedia: [
        'https://x.com/0xFacet',
        'https://discord.com/invite/facet',
      ],
    },
  },
  config: {
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: EthereumAddress('0x00000000000000000000000000000000000face7'), // how do I set anyone?
          to: EthereumAddress('0x00000000000000000000000000000000000face7'),
          sinceTimestamp: UnixTime(1715312711),
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
            '0xd0E3721bba691d3735b0827edBe893789cA1486D',
          ),
          selector: '0x45925013',
          functionSignature:
            'function submitProposal(bytes32 root, uint256 l2BlockNumber, uint256 parentId) payable returns (uint256 proposalId)',
          sinceTimestamp: UnixTime(1753156223),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd0E3721bba691d3735b0827edBe893789cA1486D',
          ),
          selector: '0x9eeeb214',
          functionSignature:
            'function proveBlock(uint256 l2BlockNumber, bytes32 root, uint256 l1BlockNumber, bytes proof)',
          sinceTimestamp: UnixTime(1753156223),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd0E3721bba691d3735b0827edBe893789cA1486D',
          ),
          selector: '0x0075552a',
          functionSignature:
            'function proveProposal(uint256 id, uint256 l1BlockNumber, bytes proof)',
          sinceTimestamp: UnixTime(1753156223),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd0E3721bba691d3735b0827edBe893789cA1486D',
          ),
          selector: '0x0062804e',
          functionSignature: 'function resolveProposal(uint256 id)',
          sinceTimestamp: UnixTime(1753156223),
        },
      },
    ],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0000000000000b07ED001607f5263D85bf28Ce4C'),
        tokens: ['ETH'],
        description: 'Fast bridge contract.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x79009BE75Ef97e17b2832CE349a1CE7e60dac262'),
        tokens: ['ETH'],
        description: 'Escrow for ETH bridge.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x8F75466D69a52EF53C7363F38834bEfC027A2909'),
        tokens: ['ETH', 'WETH'],
        description: 'L1StandardBridge (deprecated).',
      }),
    ],
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_OPTIMISTIC,
      secondLine: formatExecutionDelay(MAX_CHALLENGE_SECS),
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
    forceTransactions: FORCE_TRANSACTIONS.CANONICAL_ORDERING('EOA inbox'),
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
        'Facet uses a based sequencing model where transaction ordering is determined entirely by Ethereum L1. Users submit transactions to an immutable address on Ethereum with transaction information encoded as RLP calldata. Facet blocks preserve the exact order in which Ethereum includes these transactions. Additionally, L1 smart contracts can create Facet transactions by emitting events with the Facet event signature, where the event data payload contains the same RLP-encoded transaction data.',
      risks: [],
      references: [
        {
          title: 'Facet Inbox Address - Etherscan',
          url: 'https://etherscan.io/address/0x00000000000000000000000000000000000face7',
        },
      ],
    },
    otherConsiderations: [
      {
        name: 'Multi-bridging',
        description:
          'Facet does not designate a canonical bridge and allows multiple bridges to be deployed that use the same Rollup state for depositing and withdrawing assets. Each bridge has its own smart contract counterpart on the L2, meaning the same L1 tokens bridged through different bridges will result in different L2 token representations. The risk analysis presented in this page is based on an arbitrarily selected ETH bridge built on top of Rollup.sol that does not introduce additional trust assumptions. However, there can be multiple other bridges to Facet that introduce additional trust assumptions, such as the FacetEtherBridgeV6 fast bridge that relies on a permissioned EOA as operator for withdrawal processing.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the fast bridge EOA operator signs an invalid withdrawal.',
            isCritical: true,
          },
        ],
        references: [
          {
            title: 'L1 ETH Bridge - Etherscan',
            url: 'https://etherscan.io/address/0x79009BE75Ef97e17b2832CE349a1CE7e60dac262',
          },
          {
            title: 'L2 ETH (FFB) Bridge - Facet Explorer',
            url: 'https://explorer.facet.org/address/0xB1f7976A7d4072c776D06A0c38ab6FbD85972FD4',
          },
          {
            title: 'FacetEtherBridgeV6 - Etherscan',
            url: 'https://etherscan.io/address/0x0000000000000b07ED001607f5263D85bf28Ce4C',
          },
        ],
      },
      {
        name: 'Gas Token Minting',
        description:
          'Facet uses FCT as its native gas token, which is minted through L1 gas consumption rather than being pre-minted. FCT issuance is directly tied to the amount of calldata used in Ethereum transactions, calculated as: FCT minted = calldata gas used × mint rate. The mint rate starts at 800,000 gwei and dynamically adjusts every 10,000 Facet blocks (~1.4 days) based on a target issuance of 40 FCT per block. The system also includes annual halvings (every 2,630,000 blocks) to regulate total supply growth over time. Note that this mechanism differs from standard OP Stack guaranteed gas markets, where L1 gas is burned to purchase L2 gas for deposits through an EIP-1559-style fee market. In Facet, FCT tokens are directly minted based on L1 calldata usage rather than using a burn-to-purchase model for cross-chain gas payment. \n\n![Facet Token Minting and Bridging](/images/other-considerations/facet.png#center).',
        risks: [],
        references: [
          {
            title: 'FCT Issuance Formula - Facet Documentation',
            url: 'https://docs.facet.org/native-gas-token/fct-issuance-calculation',
          },
          {
            title: 'OP Stack Guaranteed Gas Market Specification',
            url: 'https://specs.optimism.io/protocol/guaranteed-gas-market.html?highlight=gas#rationale-for-burning-l1-gas',
          },
        ],
      },
    ],
  },
  stateValidation: {
    description:
      'Facet implements a dual-track proving system that combines optimistic proposals with bonds with ZK validity proofs. The system allows bypassing the 7-day fraud proof window by providing a ZK proof.',
    categories: [
      {
        title: 'Challenges',
        description:
          'The system operates on two parallel tracks: an optimistic track where whitelisted proposers submit state roots with ETH bonds that can be challenged within a time window, and a validity-proof track where anyone can submit direct ZK proofs for immediate resolution. Validity proofs bypass the optimistic flow and can invalidate multiple incorrect optimistic proposals simultaneously targeting the same state root. When optimistic proposals are challenged, proposers must defend their claims by providing ZK proofs within the proving window.',
      },
      {
        title: 'Validity proofs',
        description:
          "The system uses Succinct's SP1 zkVM and Prover Network to generate zero-knowledge proofs that verify L2 state transitions. Submitting a validity proof can settle disputes in a single transaction.",
        references: [
          {
            title: 'Facet ZK Fault Proofs - GitHub Repository',
            url: 'https://github.com/0xFacet/zk-fault-proofs',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: {
      [discovery.chain]: discovery.getDiscoveredContracts(),
      [l2Discovery.chain]: l2Discovery.getDiscoveredContracts(),
    },
    risks: [],
  },
  permissions: {
    [discovery.chain]: discovery.getDiscoveredPermissions(),
    [l2Discovery.chain]: l2Discovery.getDiscoveredPermissions(),
  },
  chainConfig: {
    name: 'facet',
    chainId: 1027303,
    gasTokens: ['FCT'],
    explorerUrl: 'https://explorer.facet.org',
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.facet.org/',
        callsPerMinute: 1500,
      },
    ],
  },
  milestones: [
    {
      title: 'SP1 proof system deployed',
      url: 'https://etherscan.io/tx/0x2c76f9fb8d18290ae8d75b8bcfe6ee2bd5a7548983fa1d400f83ed9db11d0b84',
      date: '2025-07-02T00:00:00Z',
      type: 'general',
      description:
        'Facet launches its optimistic rollup contract with SP1 zk fault proofs.',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/0xFacet/status/1866610169620336761',
      date: '2024-12-10T00:00:00Z',
      description: 'Facet launches at Ethereum block 21373000.',
      type: 'general',
    },
  ],
}
