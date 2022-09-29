import { ProjectId, UnixTime } from '@l2beat/types'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const omgnetwork: Layer2 = {
  type: 'layer2',
  id: ProjectId('omgnetwork'),
  display: {
    name: 'OMG Network',
    slug: 'omgnetwork',
    description:
      'OMG Network claims to be the leading value transfer network for ETH and ERC20 tokens. Using the OMG Network, individuals and businesses can transact on a financial infrastructure that is claimed to be several times faster, 1/3rd the cost, and as secure as the Ethereum Network — while retaining full autonomy over their funds and keys. The Network scales by centralizing transaction processing and remains safe by decentralizing security.',
    purpose: 'Payments',
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
        address: '0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0',
        sinceTimestamp: new UnixTime(1584424507),
        tokens: ['ETH'],
      },
      {
        address: '0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B',
        sinceTimestamp: new UnixTime(1584424719),
        tokens: '*',
      },
    ],
    events: [],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_EXITS_ONLY,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_EXIT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_U,
  },
  technology: {
    category: 'Plasma',
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
      {
        name: 'EthVault',
        address: '0x3Eed23eA148D356a72CA695DBCe2fceb40a32ce0',
      },
      {
        name: 'Erc20Vault',
        address: '0x070cB1270A4B2bA53c81CeF89d0FD584Ed4F430B',
      },
      {
        name: 'ETHDepositVerifier',
        description: CONTRACTS.UNVERIFIED_DESCRIPTION,
        address: '0x649f37203c365DE759c8fc8CA35beBF5448F70Be',
      },
      {
        name: 'ERC20DepositVerifier',
        description: CONTRACTS.UNVERIFIED_DESCRIPTION,
        address: '0xD876aeb3a443FBC03B7349AAc115E9054563CD82',
      },
      {
        name: 'PlasmaFramework',
        address: '0x0D4C1222f5e839a911e2053860e45F18921D72ac',
      },
      {
        name: 'PaymentExitGame',
        // PaymentExitGame uses unverified libraries https://etherscan.io/address/0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3
        description:
          'The source code of the PaymentStartStandardExit library used by this contract is not verified on Etherscan.',
        address: '0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
      },
    ],
    risks: [CONTRACTS.UNVERIFIED_RISK],
  },
  news: [
    {
      date: '2021-04-13',
      name: 'OMG Labs Update #03: The Road Ahead For Layer-2s',
      link: 'https://omg.network/omg-labs-update-03-the-road-ahead-for-layer-2s/',
    },
    {
      date: '2021-04-06',
      name: 'The Bigger Picture: Varna, Hashcast, and Quasar',
      link: 'https://omg.network/bigger-picture-varna-hashcast-quasar/',
    },
    {
      date: '2021-03-19',
      name: 'OMG Labs: Engineering Update #02 (ft. Varna!)',
      link: 'https://omg.network/omg-labs-engineering-update-02-ft-varna/',
    },
  ],
}
