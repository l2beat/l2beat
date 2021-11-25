import { AssetId, Exchange } from '../../model'
import { AggregatePriceRepository } from '../../peripherals/database/AggregatePriceRepository'
import { ExchangePriceRepository } from '../../peripherals/database/ExchangePriceRepository'

export class PricesView {
  constructor(
    private exchangePriceRepository: ExchangePriceRepository,
    private aggregatePriceRepository: AggregatePriceRepository
  ) {}

  async getPriceHistory(assetId: AssetId) {
    const records = await this.aggregatePriceRepository.getAllByAssetId(assetId)
    return records.map((x) => ({
      blockNumber: x.blockNumber.toString(),
      priceUsd: x.priceUsd.toString(),
    }))
  }

  async getPriceHistoryOnExchange(assetId: AssetId, exchange: Exchange) {
    const records =
      await this.exchangePriceRepository.getAllByAssetIdAndExchange(
        assetId,
        exchange
      )
    return records.map((x) => ({
      blockNumber: x.blockNumber.toString(),
      liquidity: x.liquidity.toString(),
      price: x.price.toString(),
    }))
  }
}
