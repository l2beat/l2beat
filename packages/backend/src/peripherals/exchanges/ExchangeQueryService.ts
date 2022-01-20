import { EthereumAddress, Exchange } from '@l2beat/common'

import {
  MulticallClient,
  MulticallRequest,
  MulticallResponse,
} from '../ethereum/MulticallClient'
import {
  decodeUniswapV1Results,
  encodeUniswapV1Requests,
} from './queries/uniswapV1'
import {
  decodeUniswapV2Results,
  encodeUniswapV2Requests,
} from './queries/uniswapV2'
import {
  decodeUniswapV3Results,
  encodeUniswapV3Requests,
} from './queries/uniswapV3'
import { UniswapV1Client } from './UniswapV1Client'

interface ExchangePriceQuery {
  token: EthereumAddress
  exchange: Exchange
}

interface ExchangePriceResult {
  liquidity: bigint
  price: bigint
}

export class ExchangeQueryService {
  constructor(
    private uniswapV1Client: UniswapV1Client,
    private multicallClient: MulticallClient
  ) {}

  async getPrices(queries: ExchangePriceQuery[], blockNumber: bigint) {
    const uniswapV1Exchanges = await this.getUniswapV1Exchanges(
      queries,
      blockNumber
    )
    const requests = queries.map((query) =>
      encodeRequests(query, uniswapV1Exchanges)
    )
    const results = await this.multicallNested(requests, blockNumber)
    return results.map((result, i) => decodeResults(queries[i], result))
  }

  private async getUniswapV1Exchanges(
    queries: ExchangePriceQuery[],
    blockNumber: bigint
  ) {
    const v1Queries = queries.filter((x) => x.exchange.family === 'uniswap-v1')
    if (v1Queries.length === 0) {
      return new Map<EthereumAddress, EthereumAddress>()
    }
    const exchanges = await this.uniswapV1Client.getExchangeAddresses(
      v1Queries.map((x) => x.token),
      blockNumber
    )
    const result = new Map<EthereumAddress, EthereumAddress>()
    for (const [i, exchange] of exchanges.entries()) {
      if (exchange) {
        result.set(v1Queries[i].token, exchange)
      }
    }
    return result
  }

  private async multicallNested(
    requests: MulticallRequest[][],
    blockNumber: bigint
  ) {
    const flat = requests.flat()
    const results = await this.multicallClient.multicall(flat, blockNumber)
    let index = 0
    return requests.map((request) => request.map(() => results[index++]))
  }
}

export function encodeRequests(
  query: ExchangePriceQuery,
  uniswapV1Exchanges: Map<EthereumAddress, EthereumAddress>
): MulticallRequest[] {
  switch (query.exchange.family) {
    case 'uniswap-v1':
      return encodeUniswapV1Requests(query.token, uniswapV1Exchanges)
    case 'uniswap-v2':
      return encodeUniswapV2Requests(query.token, query.exchange)
    case 'uniswap-v3':
      return encodeUniswapV3Requests(query.token, query.exchange)
  }
  throw new Error(`Unknown exchange ${query.exchange.name}`)
}

export function decodeResults(
  query: ExchangePriceQuery,
  results: MulticallResponse[]
): ExchangePriceResult {
  switch (query.exchange.family) {
    case 'uniswap-v1':
      return decodeUniswapV1Results(results)
    case 'uniswap-v2':
      return decodeUniswapV2Results(query.token, query.exchange, results)
    case 'uniswap-v3':
      return decodeUniswapV3Results(query.token, query.exchange, results)
  }
  throw new Error(`Unknown exchange ${query.exchange.name}`)
}
