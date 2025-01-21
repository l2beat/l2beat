import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import { Badge } from '../badges'
import { getStage } from '../layer2s/common/stages/getStage'
import type { Layer3 } from './types'

const discovery = new ProjectDiscovery('bugbuster', 'optimism')

export const bugbuster: Layer3 = {
  type: 'layer3',
  id: ProjectId('bugbuster'),
  createdAt: new UnixTime(1723722996), // 2024-08-15T11:56:36Z
  hostChain: ProjectId('optimism'),
  badges: [
    Badge.Stack.Cartesi,
    Badge.VM.AppChain,
    Badge.VM.CartesiVM,
    Badge.DA.EthereumCalldata,
    Badge.L3ParentChain.Optimism,
  ],
  display: {
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
    name: 'Bug Buster',
    slug: 'bugbuster',
    description:
      'Bug Buster is an open source bug bounty platform for web3, powered by Cartesi.',
    purposes: ['Bug bounty'],
    category: 'Optimistic Rollup',
    provider: 'Cartesi Rollups',
    redWarning:
      'Critical contract references can be changed by an EOA which could result in the loss of all funds.',
    links: {
      documentation: [
        'https://github.com/crypto-bug-hunters/bug-buster/blob/main/README.md',
      ],
      repositories: ['https://github.com/crypto-bug-hunters/bug-buster'],
      socialMedia: [
        'https://x.com/BugBusterApp',
        'https://t.me/+G_CPMEhCHC04MzA5',
      ],
      websites: ['https://bugbuster.app/'],
      apps: [],
      explorers: [
        'https://optimism.cartesiscan.io/applications/0x3ff5c7383f614256053c3f6b86a47ba974937299',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3ff5c7383f614256053c3f6b86a47ba974937299'),
        tokens: '*',
        description: 'DApp Contract storing bounties funds.',
      }),
    ],
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: 'UnderReview',
      },
      stage1: {
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: null,
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
      rollupNodeLink: '',
    },
  ),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately, Cartesi DApps will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the Bug Buster DApp permits invalid state roots.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system by the configured Authority.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'the DApp owner changes the consensus implementation maliciously.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'Authority.sol#L48 - Optimism Etherscan source code, submitClaim function',
          href: 'https://optimistic.etherscan.io/address/0x4246F5b1E52Fef1C52c96a9b1B679AE818d4fb35#code#F1#L48',
        },
        {
          text: 'CartesiDApp.sol#L201 - Optimism Etherscan source code, migrateToConsensus function',
          href: 'https://optimistic.etherscan.io/address/0x3ff5c7383f614256053c3f6b86a47ba974937299#code#F1#L201',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'InputBox.sol#30 - Optimism Etherscan source code, addInput function',
          href: 'https://optimistic.etherscan.io/address/0x59b22D57D4f067708AB0c00552767405926dc768#code#F1#L30',
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
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: [DA_LAYERS.ETH_CALLDATA],
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  }),

  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      value: 'None',
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'InputBox',
          references: [
            'https://optimistic.etherscan.io/address/0x59b22D57D4f067708AB0c00552767405926dc768#code#F1#L30',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(0),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stackedRiskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_L3,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
      HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
    ),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  permissions: [
    {
      name: 'BugBuster Owner',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('BugBuster', 'owner'),
        ),
      ],
      description:
        'Owner of the Bug Buster Cartesi DApp. Can change the consensus reference and therefore steal all funds.',
    },
    {
      name: 'Authority Owner',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('Authority', 'owner'),
        ),
      ],
      description:
        'Owner of the Authority contract - the current consensus implementation. Can make arbitrary claims about the current state of Bug Buster and steal all funds in the absence of fraud proofs.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('BugBuster', {
        description:
          'CartesiDApp instance for the Bug Buster DApp, responsible for holding assets and allowing the DApp to interact with other smart contracts.',
      }),
      discovery.getContractDetails('InputBox', {
        description:
          'Contract that receives arbitrary blobs as inputs to Cartesi DApps.',
      }),
      discovery.getContractDetails('ERC20Portal', {
        description:
          'Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps (like e.g. Bug Buster).',
      }),
      discovery.getContractDetails('Authority', {
        description:
          'Simple consensus model controlled by a single address, the owner.',
      }),
      discovery.getContractDetails('History', {
        description: 'Contract that stores claims for Cartesi DApps.',
      }),
    ],
    risks: [],
  },
}
