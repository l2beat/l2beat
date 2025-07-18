import type { CoinListPlatformEntry } from '@l2beat/shared'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'

export function getCoingeckoId(
  coinList: CoinListPlatformEntry[],
  platform: string | undefined,
  address: ChainSpecificAddress,
) {
  assert(
    platform !== undefined,
    'Could not find coingecko platform. Run "pnpm coingecko:platforms" and add it to discovery chain config in .ts file.',
  )

  const coin = coinList.find((coin) => {
    return (
      coin.platforms[platform]?.toLowerCase() ===
      ChainSpecificAddress.address(address).toString().toLowerCase()
    )
  })

  assert(
    coin?.id !== undefined,
    'Could not find coingeckoId for token. Please add it manually to token discovery config.',
  )

  return coin.id
}
