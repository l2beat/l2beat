import { AssetId, EthereumAddress, Exchange, Logger } from '@l2beat/common'

import { Token } from '../../model'
import {
  ExchangePriceRecord,
  ExchangePriceRepository,
} from '../../peripherals/database/ExchangePriceRepository'
import { ExchangeQueryService } from '../../peripherals/exchanges/ExchangeQueryService'
import {
  DAI,
  USDC,
  USDT,
  WETH,
} from '../../peripherals/exchanges/queries/constants'

export const UNISWAP_V1_RELEASE_BLOCK = 6627917n
export const UNISWAP_V2_RELEASE_BLOCK = 10000835n
export const UNISWAP_V3_RELEASE_BLOCK = 12369621n

export interface ExchangeAssetPriceQuery {
  assetId: AssetId
  token: EthereumAddress
  exchange: Exchange
}

export class ExchangePriceService {
  constructor(
    private exchangePriceRepository: ExchangePriceRepository,
    private exchangeQueryService: ExchangeQueryService,
    private logger: Logger
  ) {
    this.logger = this.logger.for(this)
  }

  async updateExchangePrices(tokens: Token[], blockNumber: bigint) {
    return this.updateQueries(this.getQueries(tokens, blockNumber), blockNumber)
  }

  async updateQueries(queries: ExchangeAssetPriceQuery[], blockNumber: bigint) {
    const knownPrices = await this.exchangePriceRepository.getAllByBlockNumber(
      blockNumber
    )
    const known = new Map<string, ExchangePriceRecord>()
    for (const record of knownPrices) {
      known.set(`${record.assetId}:${record.exchange.name}`, record)
    }
    const unknownQueries = queries.filter(
      (q) => !known.has(`${q.assetId}:${q.exchange.name}`)
    )
    if (unknownQueries.length > 0) {
      const unknownPrices = await this.exchangeQueryService.getPrices(
        unknownQueries,
        blockNumber
      )
      const records = unknownQueries.map((query, i): ExchangePriceRecord => {
        const { liquidity, price } = unknownPrices[i]
        return {
          assetId: query.assetId,
          blockNumber,
          exchange: query.exchange,
          liquidity,
          price,
        }
      })
      await this.exchangePriceRepository.add(records)
      for (const record of records) {
        known.set(`${record.assetId}:${record.exchange.name}`, record)
      }
    }
    return queries.map(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (query) => known.get(`${query.assetId}:${query.exchange.name}`)!
    )
  }

  getQueries(tokens: Token[], blockNumber: bigint) {
    return this.getEtherPriceQueries(blockNumber).concat(
      tokens
        .map((token) => this.getTokenPriceQueries(token, blockNumber))
        .flat()
    )
  }

  getEtherPriceQueries(blockNumber: bigint) {
    const weth = { assetId: AssetId.WETH, token: WETH }
    const queries: ExchangeAssetPriceQuery[] = []
    if (blockNumber >= UNISWAP_V1_RELEASE_BLOCK) {
      queries.push(
        {
          assetId: AssetId.DAI,
          token: DAI,
          exchange: Exchange.uniswapV1(),
        },
        {
          assetId: AssetId.USDC,
          token: USDC,
          exchange: Exchange.uniswapV1(),
        },
        {
          assetId: AssetId.USDT,
          token: USDT,
          exchange: Exchange.uniswapV1(),
        }
      )
    }
    if (blockNumber >= UNISWAP_V2_RELEASE_BLOCK) {
      for (const market of ['dai', 'usdc', 'usdt'] as const) {
        queries.push({ ...weth, exchange: Exchange.uniswapV2(market) })
      }
    }
    if (blockNumber >= UNISWAP_V3_RELEASE_BLOCK) {
      for (const market of ['dai', 'usdc', 'usdt'] as const) {
        for (const fee of [500, 3000, 10000] as const) {
          queries.push({ ...weth, exchange: Exchange.uniswapV3(market, fee) })
        }
      }
    }
    return queries
  }

  getTokenPriceQueries(token: Token, blockNumber: bigint) {
    if (token.priceStrategy.type !== 'market') {
      return []
    }
    const asset = { assetId: token.id, token: token.address as EthereumAddress }
    const queries: ExchangeAssetPriceQuery[] = []
    if (blockNumber >= UNISWAP_V1_RELEASE_BLOCK) {
      queries.push({ ...asset, exchange: Exchange.uniswapV1() })
    }
    if (blockNumber >= UNISWAP_V2_RELEASE_BLOCK) {
      for (const market of ['dai', 'usdc', 'usdt', 'weth'] as const) {
        queries.push({ ...asset, exchange: Exchange.uniswapV2(market) })
      }
    }
    if (blockNumber >= UNISWAP_V3_RELEASE_BLOCK) {
      for (const market of ['dai', 'usdc', 'usdt', 'weth'] as const) {
        for (const fee of [500, 3000, 10000] as const) {
          queries.push({ ...asset, exchange: Exchange.uniswapV3(market, fee) })
        }
      }
    }
    return queries
  }
}
