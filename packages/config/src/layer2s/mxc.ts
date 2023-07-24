import { ProjectId } from '@l2beat/shared-pure'

import {
  EXITS,
  OPERATOR,
  STATE_CORRECTNESS,
  UNDER_REVIEW_RISK_VIEW,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

export const mxc: Layer2 = {
  type: 'layer2',
  id: ProjectId('mxc'),
  display: {
    name: 'MXC zkEVM',
    slug: 'mxc',
    headerWarning: '',
    description:
      'MXC zkEVM is a new zk-rollup that provides type-1 Ethereum Virtual Machine (EVM) equivalence (opcode-level compatibility) for a transparent user experience and existing Ethereum ecosystem and tooling compatibility.',
    purpose: 'Universal',
    provider: 'taiko',
    category: 'ZK Rollup',
    links: {
      websites: ['https://www.mxc.org/'],
      apps: ['https://www.mxc.org/datadash-app'],
      documentation: ['https://doc.mxc.com/'],
      explorers: ['https://explorer.mxc.com/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/MXCfoundation',
        'https://discord.gg/mxcfoundation',
        'https://t.me/mxcfoundation',
        'https://www.linkedin.com/company/mxc-foundation/',
        'https://www.facebook.com/MXCfoundation/',
        'https://www.youtube.com/c/MXCFoundation',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://rpc.mxc.com',
    },
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: true,
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: null
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    operator: OPERATOR.DECENTRALIZED_OPERATOR,
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'Full Ethereum ZK-EVM circuits of Ethereum Foundation\'s Privacy and Scaling Explorations (PSE)',
          href: 'https://github.com/privacy-scaling-explorations/zkevm-circuits',
        },
      ],
    },
    forceTransactions: {
      description: "The anchor transaction is a way for the protocol to make use of the programmability of the EVM to enforce certain protocol behavior.",
      isIncomplete: true,
      isUnderReview: false,
      name: "Anchor transaction",
      references: [
        {
          text: '',
          href: 'https://doc.mxc.com/docs/Resources/contract-documentation/L2/MXCL2#anchor'
        }
      ],
      risks: []
    },
    dataAvailability: {description: "", isIncomplete: false, isUnderReview: false, name: "", references: [], risks: []},
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        description:
          EXITS.REGULAR('zk', 'no proof').description,
        references: [
          {
            text: 'Bridge.sol#L115 - Etherscan source code, isMessageReceived() function',
            href: 'https://arbiscan.io/address/isMessageReceived#code',
          },
        ],
      },
    ]
  },
  contracts: {
    addresses: [], risks: []
  },
  milestones: [
    {
      name: 'Wannsee Testnet is Live',
      date: '2023-06-04',
      description:
        'MXCzkEVM has launched on the Goerli testnet, allowing users and developers to test the platform.',
      link: 'https://twitter.com/MXCfoundation/status/1664950052538949634',
    },
    {
      name: 'Mainnet Alpha Launch',
      date: '2023-07-13',
      description: 'MXCzkEvm has launched on the Arbitrum One Mainnet.',
      link: 'https://twitter.com/MXCfoundation/status/1679164001106763776',
    },
  ],
}
