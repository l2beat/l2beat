import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { createEBVReports } from '../core/reports/createEBVReports'
import { ReportProject } from '../core/reports/ReportProject'
import { BalanceRecord } from '../peripherals/database/BalanceRepository'
import { PriceRecord } from '../peripherals/database/PriceRepository'
import { TotalSupplyRecord } from '../peripherals/database/TotalSupplyRepository'
import { REPORTS_MOCK as BASE_MOCK } from './mockReports'

const ARBITRUM_ESCROW_ONE = EthereumAddress.random()
const ARBITRUM_ESCROW_TWO = EthereumAddress.random()

const TOTAL_SUPPLIES: TotalSupplyRecord[] = [
  {
    assetId: AssetId.USDC,
    totalSupply: 1000n * 10n ** 6n,
    chainId: ChainId.ARBITRUM,
    timestamp: BASE_MOCK.NOW,
  },
]

const PRICES: PriceRecord[] = [
  { priceUsd: 1, assetId: AssetId.USDC, timestamp: BASE_MOCK.NOW },
  { priceUsd: 1000, assetId: AssetId.ETH, timestamp: BASE_MOCK.NOW },
]
const FUTURE_PRICES = PRICES.map((price) => ({
  ...price,
  timestamp: BASE_MOCK.NOW.add(1, 'hours'),
}))

const BALANCES: BalanceRecord[] = [
  {
    timestamp: BASE_MOCK.NOW,
    assetId: AssetId.USDC,
    holderAddress: ARBITRUM_ESCROW_ONE,
    balance: 100n * 10n ** 6n,
    chainId: ChainId.ARBITRUM,
  },
]

const FUTURE_BALANCES = BALANCES.map((balance) => ({
  ...balance,
  timestamp: BASE_MOCK.NOW.add(1, 'hours'),
}))

const PROJECT: ReportProject = {
  projectId: ProjectId.ARBITRUM,
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
}

const TOKENS: Token[] = [
  {
    id: AssetId.USDC,
    name: 'TOKEN',
    symbol: 'TOK',
    coingeckoId: CoingeckoId('token'),
    address: EthereumAddress.random(),
    sinceTimestamp: BASE_MOCK.NOW,
    decimals: 6,
    premintHolderAddresses: [],
    category: 'other',
    chainId: ChainId.ARBITRUM,
    type: 'EBV',
  },
]

const REPORTS = createEBVReports(
  PRICES,
  BALANCES,
  TOTAL_SUPPLIES,
  TOKENS,
  ProjectId.ARBITRUM,
  ChainId.ARBITRUM,
)
const FUTURE_REPORTS = createEBVReports(
  FUTURE_PRICES,
  FUTURE_BALANCES,
  TOTAL_SUPPLIES,
  TOKENS,
  ProjectId.ARBITRUM,
  ChainId.ARBITRUM,
)

// const AGGREGATED_REPORTS = aggregateReports(REPORTS, PROJECTS, NOW)
// const FUTURE_AGGREGATE_REPORTS_WITH_NATIVE_OP = aggregateReports(
//   FUTURE_REPORTS_WITH_OP,
//   PROJECTS,
//   NOW.add(1, 'hours'),
// )

export const REPORTS_MOCK = {
  ...BASE_MOCK,
  PRICES,
  REPORTS,
  BALANCES,
  TOTAL_SUPPLIES,
  TOKENS,
  PROJECT,
  FUTURE_PRICES,
  FUTURE_BALANCES,
  FUTURE_REPORTS,
}

function fakeTokenInfo(token: Partial<Token>): Token {
  return {
    name: 'Fake',
    id: AssetId('fake-token'),
    coingeckoId: CoingeckoId('fake-token'),
    symbol: 'FKT',
    decimals: 18,
    address: EthereumAddress.random(),
    sinceTimestamp: new UnixTime(0),
    category: 'other',
    chainId: ChainId.ARBITRUM,
    type: 'EBV',
    ...token,
  }
}
