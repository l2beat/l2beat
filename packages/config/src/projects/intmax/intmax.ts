import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { DA_BRIDGES, DA_LAYERS, DA_MODES } from '../../common'

const discovery = new ProjectDiscovery('intmax')

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
      name: 'All data required for payments is self-custodied by users.',
      description: 'INTMAX uses a self-custodied data availability model where users maintain their own "balance proofs" to allow for private payments. These balance proofs are computed using data received from aggregators when depositing or initiating a transfer, and from payment senders when receiving funds. The protocol ensures that all data has been made available by requiring users to sign off blocks that contain their deposits or outgoing transfers. Users would not accept payments if they have not received the necessary balance proof from the sender.',
      references: [
        {
          title: 'INTMAX Whitepaper',
          url: 'https://eprint.iacr.org/2023/1082.pdf',
        }
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'users lose the self-custodied data required to prove their balance.',
        }
      ]
    },
    operator: {},
    exitMechanisms: {},
    stateValidation: {},
    otherConsiderations: {}
  }
  riskView: {
    stateValidation: {
      value: '',
    },
    dataAvailability: {
      value: '',
    },
    exitWindow: {
      value: '',
    },
    sequencerFailure: {
      value: '',
    },
    proposerFailure: {
      value: '',
    },
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
  discoveryInfo: getDiscoveryInfo([discovery]),
  contracts: {
    addresses: {
      [discovery.chain]: discovery.getDiscoveredContracts()
    },
    risks: []
  },
  permissions: {
    [discovery.chain]: discovery.getDiscoveredPermissions(),
  }
}
