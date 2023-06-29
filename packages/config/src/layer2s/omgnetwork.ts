import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('omgnetwork')

export const omgnetwork: Layer2 = {
  type: 'layer2',
  id: ProjectId('omgnetwork'),
  isArchived: true,
  display: {
    name: 'OMG Network',
    slug: 'omgnetwork',
    description:
      'OMG Network claims to be the leading value transfer network for ETH and ERC20 tokens. Using the OMG Network, individuals and businesses can transact on a financial infrastructure that is claimed to be several times faster, 1/3rd the cost, and as secure as the Ethereum Network — while retaining full autonomy over their funds and keys. The Network scales by centralizing transaction processing and remains safe by decentralizing security.',
    purpose: 'Payments',
    category: 'Plasma',
    links: {
      websites: ['https://omg.network'],
      apps: [],
      documentation: ['https://docs.omg.network/'],
      explorers: ['https://blockexplorer.mainnet.v1.omg.network/'],
      repositories: ['https://github.com/omgnetwork/plasma-contracts'],
      socialMedia: [
        'https://twitter.com/omgnetworkhq',
        'https://discord.gg/m7NysJjKhm',
        'https://t.me/omgnetwork',
        'https://linkedin.com/company/omgnetwork/',
      ],
    },
  },
  config: {
    associatedTokens: ['OMG'],
    escrows: [
      {
        address: EthereumAddress('0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0'),
        sinceTimestamp: new UnixTime(1584424507),
        tokens: ['ETH'],
      },
      {
        address: EthereumAddress('0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B'),
        sinceTimestamp: new UnixTime(1584424719),
        tokens: '*',
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_EXITS_ONLY,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
      description:
        RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP.description +
        ' The details are unknown.',
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('OMG'),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.EXIT_FRAUD_PROOFS,
      isIncomplete: true,
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.PLASMA_OFF_CHAIN,
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
    addresses: [
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
    risks: [],
  },
}
