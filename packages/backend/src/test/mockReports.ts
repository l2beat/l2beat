import { TokenInfo } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'

import { aggregateReports } from '../core/reports/aggregateReports'
import { createReports } from '../core/reports/createReports'
import {
  OP_TOKEN_ID,
  OPTIMISM_PROJECT_ID,
} from '../core/reports/custom/optimism'
import { ReportProject } from '../core/reports/ReportProject'
import { BalanceRecord } from '../peripherals/database/BalanceRepository'
import { PriceRecord } from '../peripherals/database/PriceRepository'

const NOW = UnixTime.now().toStartOf('hour')
const ARBITRUM_ESCROW_ONE = EthereumAddress.random()
const ARBITRUM_ESCROW_TWO = EthereumAddress.random()
const OPTIMISM_ESCROW = EthereumAddress.random()

const PROJECTS: ReportProject[] = [
  {
    projectId: ProjectId('arbitrum'),
    type: 'layer2',
    escrows: [
      {
        address: ARBITRUM_ESCROW_ONE,
        sinceTimestamp: new UnixTime(0),
        tokens: [fakeTokenInfo({ id: AssetId.DAI, decimals: 18 })],
      },
      {
        address: ARBITRUM_ESCROW_TWO,
        sinceTimestamp: new UnixTime(0),
        tokens: [
          fakeTokenInfo({ id: AssetId.DAI, decimals: 18 }),
          fakeTokenInfo({ id: AssetId.ETH, decimals: 18 }),
        ],
      },
    ],
  },
  {
    projectId: ProjectId('optimism'),
    type: 'layer2',
    escrows: [
      {
        address: OPTIMISM_ESCROW,
        sinceTimestamp: new UnixTime(0),
        tokens: [fakeTokenInfo({ id: AssetId.ETH, decimals: 18 })],
      },
    ],
  },
]

const PRICES: PriceRecord[] = [
  { priceUsd: 1, assetId: AssetId.DAI, timestamp: NOW },
  { priceUsd: 1000, assetId: AssetId.ETH, timestamp: NOW },
]

const FUTURE_PRICES = PRICES.map((price) => ({
  ...price,
  timestamp: NOW.add(1, 'hours'),
}))
FUTURE_PRICES.push({
  priceUsd: 1000,
  assetId: OP_TOKEN_ID,
  timestamp: NOW.add(1, 'hours'),
})

const BALANCES: BalanceRecord[] = [
  {
    timestamp: NOW,
    assetId: AssetId.DAI,
    holderAddress: ARBITRUM_ESCROW_ONE,
    balance: 2_000n * 10n ** 18n,
    chainId: ChainId.ETHEREUM,
  },
  {
    timestamp: NOW,
    assetId: AssetId.DAI,
    holderAddress: ARBITRUM_ESCROW_TWO,
    balance: 3_000n * 10n ** 18n,
    chainId: ChainId.ETHEREUM,
  },
  {
    timestamp: NOW,
    assetId: AssetId.ETH,
    holderAddress: ARBITRUM_ESCROW_TWO,
    balance: 30n * 10n ** 18n,
    chainId: ChainId.ETHEREUM,
  },
  {
    timestamp: NOW,
    assetId: AssetId.ETH,
    holderAddress: OPTIMISM_ESCROW,
    balance: 20n * 10n ** 18n,
    chainId: ChainId.ETHEREUM,
  },
]

const FUTURE_BALANCES = BALANCES.map((balance) => ({
  ...balance,
  timestamp: NOW.add(1, 'hours'),
}))

const REPORTS = createReports(PRICES, BALANCES, PROJECTS)
const FUTURE_REPORTS = createReports(FUTURE_PRICES, FUTURE_BALANCES, PROJECTS)
// TODO: We need this mock for now, it ensures that the OP token is included in the
// future reports. This will be removed in the next step of refactoring.
const FUTURE_REPORTS_WITH_OP = [
  ...FUTURE_REPORTS,
  {
    asset: OP_TOKEN_ID,
    type: ValueType.NMV,
    amount: 644594782000000000000000000n,
    ethValue: 644594782000000n,
    usdValue: 64459478200000n,
    timestamp: NOW.add(1, 'hours'),
    projectId: OPTIMISM_PROJECT_ID,
  },
]

const AGGREGATED_REPORTS = aggregateReports(REPORTS, PROJECTS, NOW)
const FUTURE_AGGREGATE_REPORTS = aggregateReports(
  FUTURE_REPORTS_WITH_OP,
  PROJECTS,
  NOW.add(1, 'hours'),
)

const FUTURE_OP_REPORT = [
  {
    asset: OP_TOKEN_ID,
    type: ValueType.NMV,
    amount: 644594782000000000000000000n,
    ethValue: 644594782000000n,
    usdValue: 64459478200000n,
    timestamp: NOW.add(1, 'hours'),
    projectId: OPTIMISM_PROJECT_ID,
  },
]

function fakeTokenInfo(token: Partial<TokenInfo>): TokenInfo {
  return {
    name: 'Fake',
    id: AssetId('fake-token'),
    coingeckoId: CoingeckoId('fake-token'),
    symbol: 'FKT',
    decimals: 18,
    address: EthereumAddress.random(),
    sinceTimestamp: new UnixTime(0),
    category: 'other',
    ...token,
  }
}

export const REPORTS_MOCK = {
  NOW,
  PROJECTS,
  PRICES,
  FUTURE_PRICES,
  BALANCES,
  FUTURE_BALANCES,
  FUTURE_OP_REPORT,
  REPORTS,
  FUTURE_REPORTS,
  FUTURE_REPORTS_WITH_OP,
  AGGREGATED_REPORTS,
  FUTURE_AGGREGATE_REPORTS,
}
