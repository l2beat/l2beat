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
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('omgnetwork')

const upgradeDelay = 0

export const omgnetwork: ScalingProject = {
  type: 'layer2',
  id: ProjectId('omgnetwork'),
  capability: 'universal',
  addedAt: UnixTime(1623332638), // 2021-06-10T13:43:58Z
  archivedAt: UnixTime(1677196800), // 2023-02-24T00:00:00.000Z,
  display: {
    name: 'OMG Network',
    slug: 'omgnetwork',
    description:
      'OMG Network claims to be the leading value transfer network for ETH and ERC20 tokens. The Network scales by centralizing transaction processing and remains safe by decentralizing security.',
    purposes: ['Payments'],
    links: {
      websites: ['https://omg.network'],
      documentation: ['https://docs.omg.network/'],
      explorers: ['https://blockexplorer.mainnet.v1.omg.network/'],
      repositories: ['https://github.com/omgnetwork/plasma-contracts'],
      socialMedia: [
        'https://twitter.com/omgnetworkhq',
        'https://discord.gg/m7NysJjKhm',
        'https://t.me/omgnetwork',
      ],
    },
  },
  proofSystem: undefined,
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.PLASMA,
    mode: DA_MODES.BALANCE_PROOF,
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['OMG'],
    escrows: [
      {
        address: EthereumAddress('0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0'),
        sinceTimestamp: UnixTime(1584424507),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B'),
        sinceTimestamp: UnixTime(1584424719),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_EXITS_ONLY,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
      description:
        RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP.description +
        ' The details are unknown.',
    },
  },
  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.EXIT_FRAUD_PROOFS,
        isIncomplete: true,
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.PLASMA_OFF_CHAIN,
      isIncomplete: true,
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      isIncomplete: true,
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW,
      isIncomplete: true,
    },
    exitMechanisms: [
      {
        ...EXITS.PLASMA,
        isIncomplete: true,
      },
    ],
    massExit: {
      name: 'The mass exit problem is unsolved',
      description:
        'In case the operator is malicious all users need to exit within a predetermined time frame. Users that do not manage to do this will lose their funds.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'users are unable to withdraw in a mass exit event.',
        },
      ],
      isIncomplete: true,
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('EthVault'),
        discovery.getContractDetails('Erc20Vault'),
        discovery.getContractDetails('ETHDepositVerifier'),
        discovery.getContractDetails('ERC20DepositVerifier'),
        discovery.getContractDetails('PlasmaFramework'),
        discovery.getContractDetails(
          'PaymentExitGame',
          'The source code of the PaymentStartStandardExit library used by this contract is not verified on Etherscan.',
        ),
      ],
    },
    risks: [],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
