import type { CoinListPlatformEntry } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'

import type { ScriptLogger } from './ScriptLogger'

export function getCoingeckoId(
  logger: ScriptLogger,
  coinList: CoinListPlatformEntry[],
  platform: string | undefined,
  address: EthereumAddress,
) {
  logger.assert(
    platform !== undefined,
    'Could not find coingecko platform. Run "pnpm coingecko:platforms" and add it to chain config in .ts file.',
  )

  const coin = coinList.find((coin) => {
    return (
      coin.platforms[platform]?.toLowerCase() ===
      address.toString().toLowerCase()
    )
  })

  logger.assert(
    coin?.id !== undefined,
    'Could not find coingeckoId for token. Please add it manually to tokens.jsonc',
  )

  return coin.id
}
