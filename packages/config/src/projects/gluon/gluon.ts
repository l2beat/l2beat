import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
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

const upgradeDelay = 0
const discovery = new ProjectDiscovery('gluon')

export const gluon: ScalingProject = {
  type: 'layer2',
  id: ProjectId('gluon'),
  capability: 'universal',
  addedAt: UnixTime(1623332638), // 2021-06-10T13:43:58Z
  archivedAt: UnixTime(1677196800), // 2023-02-24T00:00:00.000Z,
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
      bridges: ['https://live.leverj.io/'],
      documentation: ['https://leverj.github.io/claim-gluon-balances/'],
      explorers: ['https://gluon.leverj.io/'],
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
        sinceTimestamp: UnixTime(1573694037),
        tokens: ['ETH', 'DAI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x84e34fD82FC368F1a072075114AdC4b552a7a1F4'),
        sinceTimestamp: UnixTime(1612360715),
        tokens: ['DAI', 'USDT'],
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
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
  },
  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.FRAUD_PROOFS,
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
        discovery.getContractDetails('Gluon'),
        discovery.getContractDetails('RegistryLogic'),
        discovery.getContractDetails('RegistryData'),
        discovery.getContractDetails('StakeLogic'),
        discovery.getContractDetails('StakeData'),
        discovery.getContractDetails('SpotLogic'),
        discovery.getContractDetails('SpotData'),
        discovery.getContractDetails('DerivativesLogic'),
        discovery.getContractDetails('DerivativesData'),
        discovery.getContractDetails('LegacyTokensExtension'),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
