import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

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
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('honeypot')

export const honeypot: ScalingProject = {
  archivedAt: UnixTime(1751987762), // 2025-07-08T15:16:02Z
  type: 'layer2',
  id: ProjectId('honeypot'),
  capability: 'appchain',
  addedAt: UnixTime(1683905088), // 2023-05-12T15:24:48Z
  badges: [
    BADGES.VM.CartesiVM,
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Stack.Cartesi,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Cartesi Authority Honeypot',
    shortName: 'Honeypot Authority',
    slug: 'cartesi-honeypot',
    stacks: ['Cartesi Rollups'],
    description:
      'Honeypot is an application-specific rollup designed to challenge the security of Cartesi Rollups. It provides a gamified battlefield to incentivize bug hunters to hack the application to obtain the funds locked in the rollup contract.',
    purposes: ['Bug bounty'],
    category: 'Other',

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
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: {
          satisfied: false,
          message: 'There is no onchain fraud proof system.',
          mode: 'replace',
        },
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/cartesi/rollups/tree/v1.0.2/offchain',
    },
  ),
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366',
        ),
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
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(0),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description:
          'Ultimately, Cartesi DApps will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the Honeypot DApp permits invalid state roots. Since Honeypot is immutable, this feature will not be added to the DApp.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system by the configured Authority.',
            isCritical: true,
          },
        ],
        references: [
          {
            title:
              'Authority.sol#L148 - Etherscan source code, submitClaim function',
            url: 'https://etherscan.io/address/0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f#code#F1#L48',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          title: 'InputBox.sol#30 - Etherscan source code, addInput function',
          url: 'https://etherscan.io/address/0x59b22D57D4f067708AB0c00552767405926dc768#code#F1#L30',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('optimistic'),
        references: [],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The Cartesi node software source code can be found [here](https://github.com/cartesi/rollups/tree/v1.0.2/offchain).',
    compressionScheme: 'No compression is used.',
    genesisState:
      'The genesis state is derived from the Honeypot Cartesi Machine template, which can be found within the [Honeypot server Docker image](https://hub.docker.com/layers/cartesi/honeypot/main-server-mainnet/images/sha256-9067ebcf3d915e8091aba45bd231a328a7ac260924d85387137ed133f3e240ac) at `/var/opt/cartesi/machine-snapshots/0_0`. Alternatively, it is possible to recreate it by following the build procedure outlined in the [Honeypot GitHub Repository](https://github.com/cartesi/honeypot#building-machine-to-deploy).',
    dataFormat:
      'The reference implementation for ERC20 deposits can be found [here](https://github.com/cartesi/rollups/blob/v1.0.2/onchain/rollups/contracts/common/InputEncoding.sol#L40). To learn about the withdrawal request format, please refer to the documentation [here](https://github.com/cartesi/honeypot#withdrawing-the-pot).',
  },
  contracts: {
    addresses: {
      ethereum: [
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
    ethereum: {
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
    {
      title: 'Honeypot archived',
      url: 'https://x.com/cartesiproject/status/1940757477844455765',
      date: '2025-07-08T00:00:00Z',
      description: 'Honeypot funds withdrawn, and validator turned off.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
