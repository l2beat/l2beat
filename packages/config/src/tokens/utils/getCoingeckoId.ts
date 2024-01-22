import { CoingeckoClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'

import { ScriptLogger } from './ScriptLogger'

export async function getCoingeckoId(
  coingeckoClient: CoingeckoClient,
  logger: ScriptLogger,
  address: EthereumAddress,
  platform: string | undefined,
) {
  logger.assert(
    platform !== undefined,
    'Could not find coingecko platform identifier. Please add it chain config of the project',
  )

  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const coin = coinList.find((coin) => {
    return (
      coin.platforms[platform]?.toLowerCase() ===
      address.toString().toLowerCase()
    )
  })

  logger.assert(
    coin?.id !== undefined,
    'Could not find coingeckoId for token. Please add it manually to source.jsonc',
  )

  return coin.id
}
