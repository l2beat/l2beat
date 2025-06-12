import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../../common/liveness'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('honeypot')

export const cartesiPrtHoneypot: ScalingProject = {
  type: 'layer2',
  id: ProjectId('cartesi-prt-honeypot'),
  capability: 'appchain',
  // echo "addedAt: UnixTime($(date +%s)), // $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  addedAt: UnixTime(1749678198), // 2025-06-11T21:43:18Z

  colors: {
    primary: '#00F6FF', // Cyan
    secondary: '#000000', // Black
  },

  display: {
    name: 'Cartesi PRT Honeypot',
    shortName: 'Cartesi PRT Honeypot',
    slug: 'cartesi-prt-honeypot',
    stack: 'Cartesi Rollups',
    category: 'Optimistic Rollup',

    description:
      'Cartesi PRT Honeypot is an application-specific Stage-2 rollup that stress-tests Cartesi Rollups’ security. Protected solely by Cartesi’s PRT (Permissionless Refereed Tournaments) fraud-proof algorithm, it turns its locked funds into an open bounty for anyone who can break the system.',
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
      explanation: '', // TODO PRT delay??
    },
  },

  // TODO update
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x4c1e74ef88a75c24e49eddd9f70d82a94d19251c'),
        tokens: '*',
        description: 'Contract storing bounty funds.',
      }),
    ],

    // This field is optional.
    // What should it be updated to?
    // consensus settle() perhaps?
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x6CE590b9F0697327f18c601DF6f0baE4a0801B68',
          ),
          selector: '0x8bca2e0c',
          functionSignature: 'function settle(uint256 epochNumber, bytes32 outputsMerkleRoot, bytes32[] calldata proof)',
          sinceTimestamp: UnixTime(1749510479),
        },
      },
    ],
  },

  // TODO new field, verify
  ecosystemInfo: {
    id: ProjectId('cartesi'),
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
          message:
            'Users can exit at any time and the rollup contract is immutable.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink: 'https://github.com/cartesi/dave/tree/v1.0.0/cartesi-rollups/node',
    },
  ),

  technology: {
    // TODO
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      // ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA, // TODO canonical (old) or calldata??
      references: [
        {
          title: 'InputBox.sol#18 - Etherscan source code, addInput function',
          url: 'https://etherscan.io/address/0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051#code#F1#L18',
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

  stateDerivation: {
    nodeSoftware:
      'The source code for the Cartesi node software is available [here](https://github.com/cartesi/dave/tree/v1.0.0/cartesi-rollups/node).',
    genesisState:
      'The genesis state comes from the Honeypot Cartesi Machine template included in the [Honeypot v2 release](https://github.com/cartesi/honeypot/releases/tag/v2.0.0). Alternatively, you can recreate it by following the build steps in the [Honeypot GitHub Repository](https://github.com/cartesi/honeypot/tree/v2.0.0?tab=readme-ov-file#building-the-application).',
    dataFormat: // TODO Review deposits, update withdrawal.
      'The reference implementation for ERC20 deposits can be found [here](https://github.com/cartesi/rollups-contracts/blob/v2.0.0/src/common/InputEncoding.sol#L38). To learn about the withdrawal request format, please refer to the documentation [here](https://github.com/cartesi/honeypot#withdrawing-the-pot).',
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
            title:
              'MultiLevelTournamentFactory.sol#L37 - dispute resolution factory',
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

  // TODO update
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('Honeypot', {
          description:
            'CartesiDApp instance for the Honeypot DApp, responsible for holding assets and allowing the DApp to interact with other smart contracts.',
        }),
        discovery.getContractDetails('InputBox', {
          description:
            'Contract that receives arbitrary blobs as input payloads to Cartesi DApps.',
        }),
        discovery.getContractDetails('ERC20Portal', {
          description:
            'Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.',
        }),
      ],
    },
    risks: [],
  },

  // TODO: Papers? Presentations? Honeypot v1?
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

  badges: [
    BADGES.VM.CartesiVM,
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Stack.Cartesi,
  ],
}
