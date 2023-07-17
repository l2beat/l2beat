import { TokenInfo } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'

import { ARBITRUM_PROJECT_ID } from '../core/reports/custom/arbitrum'
import { ReportProject } from '../core/reports/ReportProject'
import { TotalSupplyTokensConfig } from '../core/totalSupply/TotalSupplyTokensConfig'
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

const BALANCES: BalanceRecord[] = [
  {
    timestamp: BASE_MOCK.NOW,
    assetId: AssetId.USDC,
    holderAddress: ARBITRUM_ESCROW_ONE,
    balance: 100n * 10n ** 6n,
    chainId: ChainId.ARBITRUM,
  },
]

const PROJECT: ReportProject = {
  projectId: ARBITRUM_PROJECT_ID,
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

const TOKENS: TotalSupplyTokensConfig[] = [
  {
    assetId: AssetId.USDC,
    tokenAddress: EthereumAddress.random(),
    sinceTimestamp: BASE_MOCK.NOW,
    decimals: 6,
  },
]

export const REPORTS_MOCK = {
  ...BASE_MOCK,
  PRICES,
  BALANCES,
  TOTAL_SUPPLIES,
  TOKENS,
  PROJECT,
}

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
