import { ExchangePriceRecord } from '../../peripherals/database/ExchangePriceRepository'

export function getEtherPrice(exchangePrices: ExchangePriceRecord[]) {
  let maxLiquidity = 0n
  let record: ExchangePriceRecord | undefined

  for (const item of exchangePrices) {
    let liquidity = 0n
    if (item.assetId === 'wrapped-ether') {
      liquidity = item.liquidity
    } else if (
      item.exchange.family === 'uniswap-v1' &&
      (item.assetId === 'dai-stablecoin' ||
        item.assetId === 'usd-coin' ||
        item.assetId === 'tether-usd')
    ) {
      liquidity = (item.price * item.liquidity) / 10n ** 18n
    }

    if (liquidity > maxLiquidity) {
      maxLiquidity = liquidity
      record = item
    }
  }

  if (!record) {
    throw new Error('No records for ether price')
  }

  if (record.exchange.family === 'uniswap-v1') {
    if (record.assetId === 'dai-stablecoin') {
      return 10n ** (18n * 3n - 18n) / record.price
    } else if (
      record.assetId === 'usd-coin' ||
      record.assetId === 'tether-usd'
    ) {
      return 10n ** (18n * 3n - 6n) / record.price
    }
  } else if (
    record.exchange.family === 'uniswap-v2' ||
    record.exchange.family === 'uniswap-v3'
  ) {
    const asset = record.exchange.quoteAssetId
    if (asset === 'dai-stablecoin') {
      return record.price
    } else if (asset === 'usd-coin' || asset === 'tether-usd') {
      return record.price * 10n ** (18n - 6n)
    }
  }

  throw new Error('Cannot determine ether price')
}
