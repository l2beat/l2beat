import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getSHARPVerifierContracts } from '../discovery/starkware'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('layer2financezk')

const upgradeDelay = 0

export const layer2financezk: Layer2 = {
  type: 'layer2',
  id: ProjectId('layer2financezk'),
  isArchived: true,
  display: {
    name: 'L2.Finance-zk',
    slug: 'layer2financezk',
    warning:
      'Layer2.finance-ZK has been shut down, users are encouraged to use optimistic rollup version.',
    description:
      'Celer’s Layer2.finance in ZK proofs Mode Built with StarkEx from StarkWare.',
    purposes: ['DeFi'],
    provider: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://layer2.finance/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/celer-network/defi-pooling-broker-contracts',
      ],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x82123571C8a5e0910280C066bc634c4945FFcbC8'),
        sinceTimestamp: new UnixTime(1645130774),
        tokens: ['ETH', 'USDC', 'USDT'],
      },
      {
        address: EthereumAddress('0x8581cd55ff53F1F85A237fa9D60E72a79f0973b6'),
        sinceTimestamp: new UnixTime(1648621885),
        tokens: ['cETH'],
      },
      {
        address: EthereumAddress('0x4455E4435Cf7e6B6A4Df17bEAE1A413ef3663B90'),
        sinceTimestamp: new UnixTime(1647862894),
        tokens: ['cETH'],
      },
      {
        address: EthereumAddress('0x3F3b821243E5664822c0babBA2B4f37bf294e7a0'),
        sinceTimestamp: new UnixTime(1648621976),
        tokens: ['cUSDC'],
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC(),
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_PERPETUAL,
  },
  contracts: {
    addresses: [
      {
        name: 'StarkExchange',
        address: discovery.getContract('Proxy').address,
        upgradeability: discovery.getContract('Proxy').upgradeability,
      },
      {
        name: 'Committee',
        address: EthereumAddress('0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9'),
      },
      {
        name: 'Broker',
        description:
          'Broker manages investment strategies on L1 for tokens deposited to the system. Strategies invest in specific protocols, e.g. Compound and they escrow LP tokens as custom Wrapped tokens.',
        address: discovery.getContract('Broker').address,
      },
      {
        name: 'StrategyCompound',
        description:
          'It is through this contract that groups of users interact with the Compound DeFi protocol.',
        address: EthereumAddress('0x5b000954F70B0410685193B0afd3074B744B5C97'),
      },
      {
        name: 'GpsFactRegistryAdapter',
        address: EthereumAddress('0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE'),
      },
      {
        name: 'OrderRegistry',
        address: discovery.getContract('OrderRegistry').address,
      },
      ...getSHARPVerifierContracts(
        discovery,
        discovery.getAddressFromValue('GpsFactRegistryAdapter', 'gpsContract'),
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'Governor',
      accounts: [
        {
          address: EthereumAddress(
            '0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
    },
    {
      name: 'Data Availability Committee',
      accounts: [],
      description:
        'There exists a Data Availability Committee with unknown members and an unverified smart contract.',
    },
    {
      name: 'SHARP Verifier Governor',
      accounts: [
        {
          address: EthereumAddress(
            '0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
    },
    {
      name: 'Broker Owner',
      accounts: [
        {
          address: EthereumAddress(
            '0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Most Broker functionality is restricted only for the owner, it includes managing rides, setting prices or slippages, burning shares.',
    },
    {
      name: 'Operator',
      accounts: [
        {
          address: EthereumAddress(
            '0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Allowed to update state of the system. When Operator is down the state cannot be updated.',
    },
  ],
}
