import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

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
import { getSHARPVerifierContracts } from '../../discovery/starkware'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('layer2financezk')

const upgradeDelay = 0

export const layer2financezk: ScalingProject = {
  type: 'layer2',
  id: ProjectId('layer2financezk'),
  capability: 'universal',
  addedAt: UnixTime(1654522914), // 2022-06-06T13:41:54Z
  archivedAt: UnixTime(1677196800), // 2023-02-24T00:00:00.000Z,
  display: {
    name: 'L2.Finance-zk',
    slug: 'layer2financezk',
    warning:
      'Layer2.finance-ZK has been shut down, users are encouraged to use optimistic rollup version.',
    description:
      "Celer's Layer2.finance in ZK proofs Mode Built with StarkEx from StarkWare.",
    purposes: ['Exchange'],
    stacks: ['StarkEx'],
    links: {
      websites: ['https://layer2.finance/'],
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
  dataAvailability: undefined,
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('stone'),
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x82123571C8a5e0910280C066bc634c4945FFcbC8'),
        sinceTimestamp: UnixTime(1645130774),
        tokens: ['ETH', 'USDC', 'USDT'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x8581cd55ff53F1F85A237fa9D60E72a79f0973b6'),
        sinceTimestamp: UnixTime(1648621885),
        tokens: ['cETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x4455E4435Cf7e6B6A4Df17bEAE1A413ef3663B90'),
        sinceTimestamp: UnixTime(1647862894),
        tokens: ['cETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x3F3b821243E5664822c0babBA2B4f37bf294e7a0'),
        sinceTimestamp: UnixTime(1648621976),
        tokens: ['cUSDC'],
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC(),
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
  },
  stateValidation: {
    categories: [STATE_VALIDATION.STARKEX_VALIDITY_PROOFS],
  },
  technology: {
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_PERPETUAL,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('StarkExchange', {
          name: 'StarkExchange',
        }),
        discovery.getContractDetails('Committee'),
        discovery.getContractDetails(
          'Broker',
          'Broker manages investment strategies on L1 for tokens deposited to the system. Strategies invest in specific protocols, e.g. Compound and they escrow LP tokens as custom Wrapped tokens.',
        ),
        discovery.getContractDetails(
          'StrategyCompound',
          'It is through this contract that groups of users interact with the Compound DeFi protocol.',
        ),
        discovery.getContractDetails('GpsFactRegistryAdapter'),
        discovery.getContractDetails('OrderRegistry'),
        ...getSHARPVerifierContracts(
          discovery,
          discovery.getAddressFromValue(
            'GpsFactRegistryAdapter',
            'gpsContract',
          ),
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Governor',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e',
            ),
          ]),
          'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
        ),
        discovery.getPermissionDetails(
          'Data Availability Committee',
          [],
          'There exists a Data Availability Committee with unknown members and an unverified smart contract.',
        ),
        discovery.getPermissionDetails(
          'SHARP Verifier Governor',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
            ),
          ]),
          'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
        ),
        discovery.getPermissionDetails(
          'Broker Owner',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988',
            ),
          ]),
          'Most Broker functionality is restricted only for the owner, it includes managing rides, setting prices or slippages, burning shares.',
        ),
        discovery.getPermissionDetails(
          'Broker Owner',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5',
            ),
          ]),
          'Most Broker functionality is restricted only for the owner, it includes managing rides, setting prices or slippages, burning shares.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
