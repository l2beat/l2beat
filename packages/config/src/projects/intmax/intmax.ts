import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  OPERATOR,
  RISK_VIEW,
} from '../../common'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('intmax')
const scrollDiscovery = new ProjectDiscovery('intmax', 'scroll')

export const intmax: ScalingProject = {
  type: 'layer2',
  id: ProjectId('intmax'),
  capability: 'universal',
  addedAt: UnixTime(1722256071), // 2024-07-29T12:27:51Z
  display: {
    name: 'INTMAX',
    slug: 'intmax',
    description:
      'INTMAX is a stateless Plasma-like ZK Rollup that enables private payments and minimal onchain costs.',
    purposes: ['Payments'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://intmax.io/'],
      documentation: [
        'https://eprint.iacr.org/2023/1082.pdf',
        'https://medium.com/intmax/the-deep-dive-into-statelessness-intmax2-algorithm-was-published-be7a306048ff',
      ],
      repositories: ['https://github.com/InternetMaximalism'],
      socialMedia: ['https://twitter.com/intmaxIO'],
      bridges: ['https://app.intmax.io/bridge'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xF65e73aAc9182e353600a916a6c7681F810f79C3'),
        tokens: '*',
      }),
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.SELF_CUSTODIED_INTMAX,
    bridge: DA_BRIDGES.SELF_ATTESTED_INTMAX,
    mode: DA_MODES.BALANCE_PROOF,
  },
  technology: {
    dataAvailability: {
      name: 'All data required for payments is self-custodied by users',
      description:
        'INTMAX uses a self-custodied data availability model where users maintain their own "balance proofs" to allow for private payments. These balance proofs are computed using data received from aggregators when depositing or initiating a transfer, and from payment senders when receiving funds. The protocol ensures that all data has been made available by requiring users to sign off blocks that contain their deposits or outgoing transfers. Users would not accept payments if they have not received the necessary balance proof from the sender.',
      references: [
        {
          title: 'INTMAX Whitepaper',
          url: 'https://eprint.iacr.org/2023/1082.pdf',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'users lose the self-custodied data required to prove their balance.',
        },
      ],
    },
    operator: {
      ...OPERATOR.DECENTRALIZED_OPERATOR,
      references: [
        {
          title: 'INTMAX Block Builder - INTMAX docs',
          url: 'https://intmax-wallet.gitbook.io/intmax-developers-hub/intmax-block-builder',
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Users can autonomously exit their funds',
        description:
          'Users can autonomously exit by providing a ZK proof of sufficient balance. This requires keeping track of all funds received and sent.',
        risks: [],
        references: [
          {
            title: 'Withdrawal aggregator - Github repository',
            url: 'https://github.com/InternetMaximalism/intmax2-withdrawal-aggregator',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'Deposits are gated by Predicate AVS (AML)',
        description: 'Deposits must be signed by a Predicate AVS operator to ensure compliance with Anti-Money Laundering (AML) regulations. When a user is onboarded, it cannot be then blocked from using the system.',
        risks: [],
        references: [
          {
            title: 'Predicate docs',
            url: 'https://docs.predicate.io/essentials/introduction'
          }
        ]
      }
    ]
  },
  stateValidation: {
    description:
      "INTMAX uses validity proofs to ensure that users cannot withdraw more than they have. For every transfer made, a ZK proof is required to prove the amount that has been transferred to be subtracted from the sender's balance. If the user does not provide the proof, the balance is considered zero. For received funds, the user must provide the corresponding balance proofs as well, but if the sender has not provided the proof, the user can still withdraw the remaining balance.",
    categories: [
      {
        title: 'ZK Circuits',
        description:
          'The source code of the circuits can be found [here](https://github.com/InternetMaximalism/intmax2-zkp).',
        references: [
          {
            title: 'INTMAX Whitepaper',
            url: 'https://eprint.iacr.org/2023/1082.pdf',
          },
          {
            title: 'intmax2-zkp - Github repository',
            url: 'https://github.com/InternetMaximalism/intmax2-zkp',
          },
        ],
      },
    ],
  },

  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: {
      value: 'Self custodied',
      description:
        'All data required for payments and withdrawals is self custodied by users.',
      sentiment: 'good',
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: null,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/InternetMaximalism/intmax2-node',
    },
  ),
  discoveryInfo: getDiscoveryInfo([discovery, scrollDiscovery]),
  contracts: {
    addresses: {
      [discovery.chain]: discovery.getDiscoveredContracts(),
      [scrollDiscovery.chain]: scrollDiscovery.getDiscoveredContracts(),
    },
    risks: [],
  },
  permissions: {
    [discovery.chain]: discovery.getDiscoveredPermissions(),
    [scrollDiscovery.chain]: scrollDiscovery.getDiscoveredPermissions(),
  },
}
