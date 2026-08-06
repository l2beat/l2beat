import type { ApiTvlResponse } from './types'

const USDC_ICON_URL =
  'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694'

export function getTvl(_projectId: string): ApiTvlResponse {
  return [
    {
      tvl: Math.random() * 1_000_000_000,
      ticker: 'USDC',
      iconURL: USDC_ICON_URL,
    },
  ]
}
