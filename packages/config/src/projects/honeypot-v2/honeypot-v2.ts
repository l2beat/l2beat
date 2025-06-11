import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../../common/liveness'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('honeypot')

export const honeypot: ScalingProject = {
  type: 'layer2',
  id: ProjectId('honeypot-v2'),
  capability: 'appchain',
  // echo "addedAt: UnixTime($(date +%s)), // $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  addedAt: UnixTime(1749678198), // 2025-06-11T21:43:18Z

  badges: [
    BADGES.VM.CartesiVM,
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Stack.Cartesi,
  ],
  colors: {
    primary: '#00F6FF', // Cyan
    secondary: '#000000', // Black
  },

  display: {
    name: 'Honeypot v2 (Cartesi)',
    shortName: 'Honeypot v2',
    slug: 'cartesi-honeypot-v2',
    stack: 'Cartesi Rollups',
    category: 'Optimistic Rollup',

    description:
      'Honeypot v2 is an application-specific Stage-2 rollup that stress-tests Cartesi Rollups’ security. Protected solely by Cartesi’s PRT (Permissionless Refereed Tournaments) fraud-proof algorithm, it turns its locked funds into an open bounty for anyone who can break the system.',
    purposes: ['Bug bounty'],

    // TODO review all links
    links: {
      websites: ['https://cartesi.io/'],
      bridges: ['https://explorer.cartesi.io/stake'],
      documentation: ['https://docs.cartesi.io/cartesi-rollups/'],
      explorers: ['https://cartesiscan.io/', 'https://explorer.cartesi.io/'],
      repositories: ['https://github.com/cartesi/honeypot'],
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
        // TODO delay??
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,

        // OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING := 'Please note, for Optimistic rollups the state is not finalized until the challenge period passes.',
      },
      explanation: // TODO PRT delay??
        ''
    },
  },

  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: {
          satisfied: true,
          message: 'Fraud-proof system fully permissionless.',
          mode: 'replace',
        },
        usersHave7DaysToExit: null,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: {
          satisfied: true,
          message: 'Users can exit at any time and the rollup contract is immutable.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink: 'https://github.com/cartesi/dave/tree/v1.0.0',
    },
  ),

  // TODO update
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366'),
        tokens: '*',
        description: 'Contract storing bounty funds.',
      }),
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f',
          ),
          selector: '0xddfdfbb0',
          functionSignature: 'function submitClaim(bytes calldata _claimData)',
          sinceTimestamp: UnixTime(1694467715),
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
    stateValidation: RISK_VIEW.STATE_FP_INT,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE_NO_SEQUENCER,
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
  },

  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.FRAUD_PROOFS,

        references: [
          {
            title: 'Permissionless Refereed Tournaments',
            url: 'https://arxiv.org/abs/2212.12439',
          },
          {
            title: 'MultiLevelTournamentFactory.sol#L37 - dispute resolution factory',
            url: 'https://etherscan.io/address/0xA31C2aCfF3464658866960c0fBD3d798310272D7#code#F1#L37',
          },
          {
            title: 'DaveConsensus.sol#L149 - application consensus',
            url: 'https://etherscan.io/address/0x6CE590b9F0697327f18c601DF6f0baE4a0801B68#code#F1#L149',
          },
        ],
      },
    ],
  },

  technology: {
    // TODO
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      // ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA, // TODO canonical (old) or calldata??
      references: [
        {
          // TODO update
          title: 'InputBox.sol#30 - Etherscan source code, addInput function',
          url: 'https://etherscan.io/address/0x59b22D57D4f067708AB0c00552767405926dc768#code#F1#L30',
        },
      ],
    },

    operator: {
      ...OPERATOR.DECENTRALIZED_OPERATOR,
      references: [], // TODO?
    },

    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [], // TODO?
    },

    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('optimistic'), // TODO: changed it from REGULAR_WITHDRAWAL, verify
        references: [], // TODO?
      },
    ],
  },

  // TODO everything below here!
  stateDerivation: {
    nodeSoftware: `The Cartesi node software source code can be found [here](https://github.com/cartesi/rollups/tree/v1.0.2/offchain).`,
    compressionScheme: 'No compression is used.',
    genesisState:
      'The genesis state is derived from the Honeypot Cartesi Machine template, which can be found within the [Honeypot server Docker image](https://hub.docker.com/layers/cartesi/honeypot/main-server-mainnet/images/sha256-9067ebcf3d915e8091aba45bd231a328a7ac260924d85387137ed133f3e240ac) at `/var/opt/cartesi/machine-snapshots/0_0`. Alternatively, it is possible to recreate it by following the build procedure outlined in the [Honeypot GitHub Repository](https://github.com/cartesi/honeypot#building-machine-to-deploy).',
    dataFormat:
      'The reference implementation for ERC20 deposits can be found [here](https://github.com/cartesi/rollups/blob/v1.0.2/onchain/rollups/contracts/common/InputEncoding.sol#L40). To learn about the withdrawal request format, please refer to the documentation [here](https://github.com/cartesi/honeypot#withdrawing-the-pot).',
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('Honeypot', {
          description:
            'CartesiDApp instance for the Honeypot DApp, responsible for holding assets and allowing the DApp to interact with other smart contracts.',
        }),
        discovery.getContractDetails('InputBox', {
          description:
            'Contract that receives arbitrary blobs as inputs to Cartesi DApps.',
        }),
        discovery.getContractDetails('ERC20Portal', {
          description:
            'Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.',
        }),
        discovery.getContractDetails('Authority', {
          description:
            'Simple consensus model controlled by a single address, the owner.',
        }),
        discovery.getContractDetails('History', {
          description: 'Contract that stores claims for Cartesi DApps.',
        }),
      ],
    },
    risks: [],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Authority owner',
          discovery.getPermissionedAccounts('Authority', 'owner'),
          'The Authority owner can submit claims to the Honeypot DApp.',
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Honeypot announcement',
      url: 'https://medium.com/cartesi/cartesi-ecosystem-update-2023-124b384401cc#:~:text=Honeypot%20DApp%20on%20Mainnet',
      date: '2023-04-11T00:00:00Z',
      description: 'Honeypot first announced to the community.',
      type: 'general',
    },
    {
      title: 'Honeypot launch',
      url: 'https://x.com/cartesiproject/status/1706685141421047982',
      date: '2023-09-26T00:00:00Z',
      description: 'Honeypot launched on mainnet.',
      type: 'general',
    },
  ],
}
