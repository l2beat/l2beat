import { Token } from '../../model'
import { ExchangePriceRecord } from '../../peripherals/database/ExchangePriceRepository'

export function getTokenPrice(
  token: Token,
  exchangePrices: ExchangePriceRecord[],
  etherPrice: bigint
) {
  if (token.priceStrategy.type === 'constant') {
    return token.priceStrategy.value
  } else if (token.priceStrategy.type === 'ether') {
    return etherPrice
  }

  let maxLiquidity = 0n
  let record: ExchangePriceRecord | undefined

  for (const item of exchangePrices) {
    if (item.assetId === token.id) {
      if (item.liquidity > maxLiquidity) {
        maxLiquidity = item.liquidity
        record = item
      }
    }
  }

  if (!record) {
    throw new Error(`No records for ${token.id} price`)
  }

  const asset = record.exchange.quoteAssetId
  if (asset === 'dai-stablecoin') {
    return record.price
  } else if (asset === 'usd-coin' || asset === 'tether-usd') {
    return record.price * 10n ** (18n - 6n)
  } else if (asset === 'wrapped-ether' || asset === 'ether') {
    return (record.price * etherPrice) / 10n ** 18n
  }

  throw new Error(`Cannot determine ${token.id} price`)
}
