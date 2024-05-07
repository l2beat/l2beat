import { assert } from '@l2beat/backend-tools'
import {
  AmountConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
} from '@l2beat/shared-pure'

export class IdConverter {
  prices: Map<string, PriceConfigEntry>

  constructor(prices: PriceConfigEntry[]) {
    this.prices = getPriceConfigIds(prices)
  }

  getPriceConfigFromAmountConfig(
    amountConfig: AmountConfigEntry,
  ): PriceConfigEntry {
    const assetId = createAssetId(amountConfig)

    const priceConfig = this.prices.get(assetId)

    assert(
      priceConfig,
      `Price config not found for asset ${assetId} on chain ${amountConfig.chain}`,
    )

    return priceConfig
  }
}

type PriceConfigIdMap = Map<string, PriceConfigEntry>

function getPriceConfigIds(prices: PriceConfigEntry[]): PriceConfigIdMap {
  const result = new Map<string, PriceConfigEntry>()
  for (const p of prices) {
    result.set(createAssetId(p), p)
  }

  return result
}

function createAssetId(asset: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${asset.chain}-${asset.address.toString()}`
}
