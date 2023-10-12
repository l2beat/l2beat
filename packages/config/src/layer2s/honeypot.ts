import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('honeypot')

export const honeypot: Layer2 = {
  type: 'layer2',
  id: ProjectId('honeypot'),
  display: {
    name: 'Honeypot (Cartesi)',
    slug: 'cartesi-honeypot',
    description:
      'Honeypot is an application-specific rollup designed to challenge the security of Cartesi Rollups.\
       Bug hunters are incentivized to hack the application to obtain the funds locked in the rollup contract.\
       Honeypot holds real assets with a dual objective: setting a financial benchmark for secure asset management\
       and providing a gamified battlefield for the community to help audit and test Cartesi Rollups.',
    purpose: 'Bug bounty',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://cartesi.io/'],
      apps: [],
      documentation: ['https://docs.cartesi.io/cartesi-rollups/'],
      explorers: ['https://cartesiscan.io/'],
      repositories: ['https://github.com/cartesi/honeypot'],
      socialMedia: [
        'https://twitter.com/cartesiproject',
        'https://discord.gg/G2tCH5KkcM',
        'https://cartesi.io/blog/',
      ],
    },
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: true,
    },
    stage1: {
      stateVerificationOnL1: [false, 'There is no onchain fraud proof system.'],
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
  }),
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366'),
        tokens: '*',
        description: 'Contract storing bounty funds.',
      }),
    ],
  },
  riskView: makeBridgeCompatible({
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
            'https://etherscan.io/address/0x59b22D57D4f067708AB0c00552767405926dc768#code#F1#L30',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADABLE_NO,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(0),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
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
          text: 'Authority.sol#L148 - Etherscan source code, submitClaim function',
          href: 'https://etherscan.io/address/0x9DB17B9426E6d3d517a969994E7ADDadbCa9C45f#code#F1#L48',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'InputBox.sol#30 - Etherscan source code, addInput function',
          href: 'https://etherscan.io/address/0x59b22D57D4f067708AB0c00552767405926dc768#code#F1#L30',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
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
  contracts: {
    addresses: [
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
    risks: [],
  },
  milestones: [
    {
      name: 'Honeypot announcement',
      link: 'https://medium.com/cartesi/cartesi-ecosystem-update-2023-124b384401cc#:~:text=Honeypot%20DApp%20on%20Mainnet',
      date: '2023-04-11T00:00:00Z',
      description: 'Honeypot first announced to the community.',
    },
    {
      name: 'Honeypot launch',
      link: 'https://x.com/cartesiproject/status/1706685141421047982',
      date: '2023-09-26T00:00:00Z',
      description: 'Honeypot launched on mainnet.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Application-Specific Rollups',
      url: 'https://medium.com/cartesi/application-specific-rollups-e12ed5d9de01',
    },
  ],
}
