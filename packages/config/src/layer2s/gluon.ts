import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { Layer2 } from './types'

const upgradeDelay = 0

export const gluon: Layer2 = {
  type: 'layer2',
  id: ProjectId('gluon'),
  isArchived: true,
  display: {
    name: 'Gluon',
    slug: 'gluon',
    description:
      'Gluon aims to be a Layer 2 scalable trading engine built on top of Ethereum, unlocking low fees and high frequency trading.',
    warning:
      'LeverJ trading platform appears to be in a maintenance mode as the team moved to build NFT trading platform. Social medias associated with the project are silent since mid 2021.',
    purposes: ['Exchange'],
    category: 'Plasma',
    links: {
      websites: ['https://gluon.network/', 'https://leverj.io/'],
      apps: ['https://live.leverj.io/'],
      documentation: ['https://leverj.io/assets/documents/Gluon-Layer2.pdf'],
      explorers: ['https://gluon.leverj.io/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Leverj_io',
        'https://t.me/leverj',
        'https://discord.gg/xpsjfwn',
        'https://blog.leverj.io/',
        'https://linkedin.com/company/leverj/',
        'https://youtube.com/channel/UCGor-eEpq0ObqN9u3jutq2w',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB'),
        sinceTimestamp: new UnixTime(1573694037),
        tokens: ['ETH', 'DAI'],
      },
      {
        address: EthereumAddress('0x84e34fD82FC368F1a072075114AdC4b552a7a1F4'),
        sinceTimestamp: new UnixTime(1612360715),
        tokens: ['DAI', 'USDT'],
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'Fraud proofs (!)',
      description:
        'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Because the data is not present on chain the security of fraud proofs is severely weakened.',
      sentiment: 'warning',
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.FRAUD_PROOFS,
      isIncomplete: true,
    },
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
    addresses: [
      {
        name: 'Gluon',
        address: EthereumAddress('0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB'),
      },
      {
        name: 'RegistryLogic',
        address: EthereumAddress('0x385827aC8d1AC7B2960D4aBc303c843D9f87Bb0C'),
        upgradeability: {
          type: 'Reference',
          base: 'Gluon',
          method: 'function current(uint32 id) view returns(address)',
          args: [0],
        },
      },
      {
        name: 'RegistryData',
        address: EthereumAddress('0x0fC25C7931679B838209c484d49Df0Cb9E633C41'),
        upgradeability: {
          type: 'Reference',
          base: 'RegistryLogic',
          method: 'function data() view returns(address)',
        },
      },
      {
        name: 'StakeLogic',
        address: EthereumAddress('0x84e34fD82FC368F1a072075114AdC4b552a7a1F4'),
        upgradeability: {
          type: 'Reference',
          base: 'Gluon',
          method: 'function current(uint32 id) view returns(address)',
          args: [1],
        },
      },
      {
        name: 'StakeData',
        address: EthereumAddress('0xaB3AC436D66CBEeDc734ed2c1562c3a213c9bc77'),
        upgradeability: {
          type: 'Reference',
          base: 'StakeLogic',
          method: 'function data() view returns(address)',
        },
      },
      {
        name: 'SpotLogic',
        address: EthereumAddress('0x2D627FF93d32f5FEBb04d68409A889895B4aef2D'),
        upgradeability: {
          type: 'Reference',
          base: 'Gluon',
          method: 'function current(uint32 id) view returns(address)',
          args: [2],
        },
      },
      {
        name: 'SpotData',
        address: EthereumAddress('0x0d283D685F0A741C463846176e4c8EFF90D3F9EC'),
        upgradeability: {
          type: 'Reference',
          base: 'SpotLogic',
          method: 'function data() view returns(address)',
        },
      },
      {
        name: 'DerivativesLogic',
        address: EthereumAddress('0xDfBFe895e07e5115773Cb9631CB2148114589caC'),
        upgradeability: {
          type: 'Reference',
          base: 'Gluon',
          method: 'function current(uint32 id) view returns(address)',
          args: [3],
        },
      },
      {
        name: 'DerivativesData',
        address: EthereumAddress('0x563052914Fd973a2305763269A106a7B0B6D50Cc'),
        upgradeability: {
          type: 'Reference',
          base: 'DerivativesLogic',
          method: 'function data() view returns(address)',
        },
      },
      {
        name: 'LegacyTokensExtension',
        address: EthereumAddress('0xDA88EfA53c85Afa30564bb651A2E76b99a232082'),
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
