import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  LogLevel,
  UnixTime,
} from '@l2beat/common'
import { config as dotenv } from 'dotenv'

import { Config } from './Config'
import { getEnv } from './getEnv'

export function getLocalConfig(): Config {
  dotenv()
  return {
    name: 'Backend/Local',
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'pretty',
    },
    port: getEnv.integer('PORT', 3000),
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    databaseUrl: getEnv('LOCAL_DB_URL'),
    core: {
      // TODO: This should probably be configurable
      minBlockTimestamp: UnixTime.now().toStartOf('day').add(-7, 'days'),
      safeBlockRefreshIntervalMs: 30 * 1000,
      safeBlockBlockOffset: 100n,
    },
    tokens: [
      {
        id: AssetId.WETH,
        symbol: 'WETH',
        decimals: 18,
        address: EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
        coingeckoId: CoingeckoId('weth'),
      },
      {
        id: AssetId.DAI,
        symbol: 'DAI',
        decimals: 18,
        address: EthereumAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F'),
        coingeckoId: CoingeckoId('dai'),
      },
      {
        id: AssetId.USDC,
        symbol: 'USDC',
        decimals: 6,
        address: EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
        coingeckoId: CoingeckoId('usdc'),
      },
      {
        id: AssetId.USDT,
        symbol: 'USDT',
        decimals: 6,
        address: EthereumAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7'),
        coingeckoId: CoingeckoId('tether'),
      },
      {
        id: AssetId('compound-usdt'),
        symbol: 'cUSDT',
        decimals: 8,
        address: EthereumAddress('0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9'),
        coingeckoId: CoingeckoId('compound-usdt'),
      },
      {
        id: AssetId('compound'),
        symbol: 'COMP',
        decimals: 18,
        address: EthereumAddress('0xc00e94Cb662C3520282E6f5717214004A7f26888'),
        coingeckoId: CoingeckoId('compound-governance-token'),
      },
    ],
  }
}
