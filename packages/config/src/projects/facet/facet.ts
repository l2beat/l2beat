import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  DATA_ON_CHAIN,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { getRollupStage } from '../../common/stages/getRollupStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getSP1Verifiers } from '../../templates/opStack'

const discovery = new ProjectDiscovery('facet')

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

const facetProgramHashes = []
facetProgramHashes.push(
  discovery.getContractValue<string>('Rollup', 'AGG_VKEY'),
)
facetProgramHashes.push(
  discovery.getContractValue<string>('Rollup', 'RANGE_VKEY_COMMITMENT'),
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
      'Sequencing mechanism via L1 through the Inbox and state validation mechanism via the Rollup proof system',
      'The Rollup contract and its upgradability',
    ],
    notInScope: [
      'Bridges built on top of the Rollup, including the legacy L1Bridge (eth:0x4e2eba30…, immutably bound to the deprecated Rollup) and the operator-controlled FacetEtherBridgeV6 fast bridge — each bridge carries its own trust assumptions and must be assessed separately',
      'Bridged token compatibility with other DeFi applications e.g., Bluebird WETH (BBWETH)',
      'The soundness of the ZK proof system of Rollup',
    ],
  },
  proofSystem: {
    type: 'Optimistic',
    name: 'SP1',
    zkCatalogId: ProjectId('sp1turbo'),
    challengeProtocol: 'Single-step',
  },
  stage: getRollupStage(
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
        noRedTrustedSetups: true,
        programHashesReproducible: true,
        proverSourcePublished: true,
        verifierContractsReproducible: true,
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
    name: 'Facet v1',
    slug: 'facet',
    description:
      'Facet v1 is a based rollup built on OP-Succinct. It uses FCT as its native gas token, which is mintable by burning ETH on L1. Facet does not designate a single canonical bridge: the Rollup contract publishes state roots that anyone can use to deploy a bridge with its own L1 escrow and L2 minter.',
    purposes: ['Universal'],
    links: {
      websites: ['https://facet.org/'],
      bridges: [
        'https://bluebird-bridge.facet.org/',
        'https://facetswap.com/bridge',
      ],
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
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x0000000000000b07ED001607f5263D85bf28Ce4C',
        ),
        tokens: ['ETH'],
        bridgedUsing: {
          bridges: [
            {
              name: 'Facet fast bridge',
            },
          ],
        },
        description:
          'Operator-controlled fast external ETH bridge; withdrawals are processed by a permissioned EOA and do not depend on the Rollup state.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x8F75466D69a52EF53C7363F38834bEfC027A2909',
        ),
        tokens: ['ETH', 'WETH'],
        bridgedUsing: {
          bridges: [
            {
              name: 'Facet deprecated bridge',
            },
          ],
        },
        description: 'L1ETHLockbox (deprecated).',
      }),
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          to: EthereumAddress('0x00000000000000000000000000000000000face7'),
          sinceTimestamp: UnixTime(1715312711),
        },
      },
      // Deprecated Rollup (0x686E7d01…) — kept for historical liveness/cost continuity; stopped receiving proposals on 2026-05-19.
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x686E7d01C7BFCB563721333A007699F154C04eb4',
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
            '0x686E7d01C7BFCB563721333A007699F154C04eb4',
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
            '0x686E7d01C7BFCB563721333A007699F154C04eb4',
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
            '0x686E7d01C7BFCB563721333A007699F154C04eb4',
          ),
          selector: '0x0062804e',
          functionSignature: 'function resolveProposal(uint256 id)',
          sinceTimestamp: UnixTime(1753156223),
        },
      },
      // Active Rollup (0x026902ef…) — deployed 2026-05-18, took over proposals 2026-05-19.
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x026902ef5a0931f25cbb78b5dd7a72ee998569ae',
          ),
          selector: '0x45925013',
          functionSignature:
            'function submitProposal(bytes32 root, uint256 l2BlockNumber, uint256 parentId) payable returns (uint256 proposalId)',
          sinceTimestamp: UnixTime(1779135407),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x026902ef5a0931f25cbb78b5dd7a72ee998569ae',
          ),
          selector: '0x9eeeb214',
          functionSignature:
            'function proveBlock(uint256 l2BlockNumber, bytes32 root, uint256 l1BlockNumber, bytes proof)',
          sinceTimestamp: UnixTime(1779135407),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x026902ef5a0931f25cbb78b5dd7a72ee998569ae',
          ),
          selector: '0x0075552a',
          functionSignature:
            'function proveProposal(uint256 id, uint256 l1BlockNumber, bytes proof)',
          sinceTimestamp: UnixTime(1779135407),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x026902ef5a0931f25cbb78b5dd7a72ee998569ae',
          ),
          selector: '0x0062804e',
          functionSignature: 'function resolveProposal(uint256 id)',
          sinceTimestamp: UnixTime(1779135407),
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
      initialBond: { value: formatEther(proposerBond) },
      permissioned: false,
      defenderAdvantage: 'not-assessed',
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
        name: 'No canonical bridge',
        description:
          "Facet's `Rollup` contract publishes L2 state roots but is not paired with a canonical bridge escrow. Anyone can deploy a bridge that reads the `Rollup`'s anchor state root to bridge arbitrary tokens; each bridge has its own L2 counterpart, so the same L1 token bridged through different bridges results in different L2 representations. Trust assumptions (operator role, upgradeability, withdrawal logic) are bridge-specific and do not propagate from the `Rollup`. The risk analysis on this page covers the `Rollup` and its proof system only; any bridge built on top must be assessed separately. Known bridges today include the `FacetEtherBridgeV6` fast ETH bridge, whose withdrawals are processed by a permissioned EOA operator and do not depend on the `Rollup` state, and a legacy `L1Bridge` immutably bound to `RollupDeprecated`, which no longer receives state-root proposals.",
        risks: [],
        references: [
          {
            title: 'Rollup - Etherscan',
            url: 'https://etherscan.io/address/0x026902ef5a0931f25cbb78b5dd7a72ee998569ae',
          },
          {
            title: 'FacetEtherBridgeV6 (fast bridge) - Etherscan',
            url: 'https://etherscan.io/address/0x0000000000000b07ED001607f5263D85bf28Ce4C',
          },
          {
            title: 'Legacy L1Bridge - Etherscan',
            url: 'https://etherscan.io/address/0x4e2eba30a786c0643699b92234d74a71e958c08e',
          },
        ],
      },
      {
        name: 'Gas Token Minting',
        description: `Facet uses FCT as its native gas token, which is minted through L1 gas consumption rather than being pre-minted. FCT issuance is directly tied to the amount of L1 ETH burned to pay calldata gas in Ethereum transactions, calculated as:

                      FCT minted = ETH burned for calldata × mint rate

                      ETH burned for calldata = L1 base fee × (total L1 gas cost - 21,000)

                      The system targets issuing ~78,300 FCT every 500 Facet blocks. If less than the target is minted in 500 blocks, the mint rate increases proportionally (up to a maximum 4x increase). If the target is reached in fewer than 500 blocks, the mint rate decreases proportionally (up to a maximum 75% decrease).

                      The maximum supply of FCT is ~1.65B. Once 50% of the supply is minted, the per-period target (now ~78,300) will be halved. It will be halved again at 75%, then at 87.5%, and so forth. The period target and period length are selected so that halvings will occur approximately every 5,256,000 blocks.

                      This mechanism is similar to standard OP Stack guaranteed gas markets, where L1 gas is burned to purchase L2 gas for deposits through an EIP-1559-style fee market. However, on Facet, gas purchased in this way accrues to the purchaser's native balance on the L2, whereas in the OP Stack it can only be used for a single transaction.

                      ![Facet Token Minting and Bridging](/images/other-considerations/facet.png#center).`,
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
          "The system uses Succinct's SP1 zkVM and Prover Network to generate zero-knowledge proofs that verify L2 state transitions. Anyone can submit a validity proof through the proveBlock() function of the Rollup contract to bypass the optimistic flow and settle an anchor block. Submitting a validity proof during a challenge settles the dispute in a single transaction.",
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
    addresses: discovery.getDiscoveredContracts(),
    risks: [],
    programHashes: facetProgramHashes.map((el) => PROGRAM_HASHES(el)),
    zkVerifiers: getSP1Verifiers(discovery),
  },
  permissions: discovery.getDiscoveredPermissions(),
  chainConfig: {
    name: 'facet',
    chainId: 1027303,
    gasTokens: ['FCT'],
    explorerUrl: 'https://explorer.facet.org',
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.facet.org/',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://explorer.facet.org/api',
      },
    ],
  },
  milestones: [
    {
      title: 'Rollup redeployed',
      url: 'https://etherscan.io/address/0x026902ef5a0931f25cbb78b5dd7a72ee998569ae',
      date: '2026-05-18T00:00:00Z',
      type: 'general',
      description:
        'New Rollup contract takes over state-root proposals with a new SP1VerifierGateway.',
    },
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
