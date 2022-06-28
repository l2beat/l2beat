import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'

import { ProjectInfo } from '../../../src/model'
import { BalanceRecord } from '../../../src/peripherals/database/BalanceRepository'
import { PriceRecord } from '../../../src/peripherals/database/PriceRepository'

export const NOW = UnixTime.now().toStartOf('hour')
const ARBITRUM_BRIDGE_ONE = EthereumAddress.random()
const ARBITRUM_BRIDGE_TWO = EthereumAddress.random()
const OPTIMISM_BRIDGE = EthereumAddress.random()

export const PRICES: PriceRecord[] = [
  { priceUsd: 1, assetId: AssetId.DAI, timestamp: NOW },
  { priceUsd: 1000, assetId: AssetId.ETH, timestamp: NOW },
]

export const BALANCES: BalanceRecord[] = [
  {
    timestamp: NOW,
    assetId: AssetId.DAI,
    holderAddress: ARBITRUM_BRIDGE_ONE,
    balance: 2_000n * 10n ** 18n,
  },
  {
    timestamp: NOW,
    assetId: AssetId.DAI,
    holderAddress: ARBITRUM_BRIDGE_TWO,
    balance: 3_000n * 10n ** 18n,
  },
  {
    timestamp: NOW,
    assetId: AssetId.ETH,
    holderAddress: ARBITRUM_BRIDGE_TWO,
    balance: 30n * 10n ** 18n,
  },
  {
    timestamp: NOW,
    assetId: AssetId.ETH,
    holderAddress: OPTIMISM_BRIDGE,
    balance: 20n * 10n ** 18n,
  },
]

export const PROJECTS: ProjectInfo[] = [
  {
    projectId: ProjectId('arbitrum'),
    name: 'Arbitrum',

    bridges: [
      {
        address: ARBITRUM_BRIDGE_ONE,
        sinceBlock: 0,
        tokens: [fakeTokenInfo({ id: AssetId.DAI, decimals: 18 })],
      },
      {
        address: ARBITRUM_BRIDGE_TWO,
        sinceBlock: 0,
        tokens: [
          fakeTokenInfo({ id: AssetId.DAI, decimals: 18 }),
          fakeTokenInfo({ id: AssetId.ETH, decimals: 18 }),
        ],
      },
    ],
  },
  {
    projectId: ProjectId('optimism'),
    name: 'Optimism',
    bridges: [
      {
        address: OPTIMISM_BRIDGE,
        sinceBlock: 0,
        tokens: [fakeTokenInfo({ id: AssetId.ETH, decimals: 18 })],
      },
    ],
  },
]

export function fakeTokenInfo(token: Partial<TokenInfo>): TokenInfo {
  return {
    name: 'Fake',
    id: AssetId('fake-token'),
    coingeckoId: CoingeckoId('fake-token'),
    symbol: 'FKT',
    decimals: 18,
    address: EthereumAddress.random(),
    sinceBlock: 0,
    category: 'other',
    ...token,
  }
}
