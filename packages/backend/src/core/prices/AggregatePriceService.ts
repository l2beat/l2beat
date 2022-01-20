import { AssetId, Logger } from '@l2beat/common'

import { Token } from '../../model'
import {
  AggregatePriceRecord,
  AggregatePriceRepository,
} from '../../peripherals/database/AggregatePriceRepository'
import { ExchangePriceService } from './ExchangePriceService'
import { getEtherPrice } from './getEtherPrice'
import { getTokenPrice } from './getTokenPrice'

export class AggregatePriceService {
  constructor(
    private aggregatePriceRepository: AggregatePriceRepository,
    private exchangePriceService: ExchangePriceService,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  async updateAggregatePrices(tokens: Token[], blockNumber: bigint) {
    if (tokens.length === 0) {
      return
    }
    const knownPrices = await this.aggregatePriceRepository.getAllByBlockNumber(
      blockNumber
    )
    const exchangePrices = await this.exchangePriceService.updateExchangePrices(
      tokens,
      blockNumber
    )
    const etherPrice = getEtherPrice(exchangePrices)
    const tokenPrices = tokens.map((token): AggregatePriceRecord => {
      return {
        assetId: token.id,
        blockNumber,
        priceUsd: getTokenPrice(token, exchangePrices, etherPrice),
      }
    })

    tokenPrices.push({
      assetId: AssetId('ether'),
      blockNumber,
      priceUsd: etherPrice,
    })

    const knownLookup = new Map(knownPrices.map((x) => [x.assetId, x.priceUsd]))
    const newOrUpdated = tokenPrices.filter((x) => {
      const knownPrice = knownLookup.get(x.assetId)
      return knownPrice === undefined || knownPrice !== x.priceUsd
    })

    if (newOrUpdated.length > 0) {
      await this.aggregatePriceRepository.addOrUpdate(newOrUpdated)
    }
  }
}
