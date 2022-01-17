import { expect } from 'earljs'

import { EthereumAddress, Exchange } from '../../../src/model'
import { MulticallClient } from '../../../src/peripherals/ethereum/MulticallClient'
import { ExchangeQueryService } from '../../../src/peripherals/exchanges/ExchangeQueryService'
import { DAI, WETH } from '../../../src/peripherals/exchanges/queries/constants'
import { encodeUniswapV1Requests } from '../../../src/peripherals/exchanges/queries/uniswapV1'
import { encodeUniswapV2Requests } from '../../../src/peripherals/exchanges/queries/uniswapV2'
import { encodeUniswapV3Requests } from '../../../src/peripherals/exchanges/queries/uniswapV3'
import { UniswapV1Client } from '../../../src/peripherals/exchanges/UniswapV1Client'
import { mock } from '../../mock'
import {
  encodeUniswapV1Results,
  encodeUniswapV2Results,
  encodeUniswapV3Results,
} from './queries/utils'

describe(ExchangeQueryService.name, () => {
  const TOKEN_A = EthereumAddress('0x' + 'a'.repeat(40))
  const TOKEN_B = EthereumAddress('0x' + 'b'.repeat(40))
  const EXCHANGE = EthereumAddress('0x' + 'c'.repeat(40))

  it('supports Uniswap V1', async () => {
    const uniswapV1Client = mock<UniswapV1Client>({
      async getExchangeAddresses(tokens) {
        expect(tokens).toEqual([TOKEN_A, TOKEN_B])
        return [EXCHANGE, undefined]
      },
    })
    const multicallClient = mock<MulticallClient>({
      async multicall(requests, blockNumber) {
        expect(requests).toEqual([
          ...encodeUniswapV1Requests(TOKEN_A, new Map([[TOKEN_A, EXCHANGE]])),
        ])
        expect(blockNumber).toEqual(12345n)
        return [...encodeUniswapV1Results(10_000n, 20_000n)]
      },
    })
    const exchangeQueryService = new ExchangeQueryService(
      uniswapV1Client,
      multicallClient
    )

    const results = await exchangeQueryService.getPrices(
      [
        { token: TOKEN_A, exchange: Exchange.uniswapV1() },
        { token: TOKEN_B, exchange: Exchange.uniswapV1() },
      ],
      12345n
    )
    expect(results).toEqual([
      { liquidity: 20_000n, price: 10n ** 18n / 2n },
      { liquidity: 0n, price: 0n },
    ])
  })

  it('supports Uniswap V2', async () => {
    const uniswapV1Client = mock<UniswapV1Client>()
    const multicallClient = mock<MulticallClient>({
      async multicall(requests, blockNumber) {
        expect(requests).toEqual([
          ...encodeUniswapV2Requests(DAI, Exchange.uniswapV2('weth')),
        ])
        expect(blockNumber).toEqual(12345n)
        return [...encodeUniswapV2Results(4_000_000n, 1_000n)]
      },
    })
    const exchangeQueryService = new ExchangeQueryService(
      uniswapV1Client,
      multicallClient
    )

    const results = await exchangeQueryService.getPrices(
      [{ token: DAI, exchange: Exchange.uniswapV2('weth') }],
      12345n
    )
    expect(results).toEqual([
      { liquidity: 4_000_000n, price: 10n ** 18n / 4_000n },
    ])
  })

  it('supports Uniswap V3', async () => {
    const uniswapV1Client = mock<UniswapV1Client>()
    const multicallClient = mock<MulticallClient>({
      async multicall(requests, blockNumber) {
        expect(requests).toEqual([
          ...encodeUniswapV3Requests(DAI, Exchange.uniswapV3('weth', 3000)),
        ])
        expect(blockNumber).toEqual(12345n)
        return [
          ...encodeUniswapV3Results(4_000_000n, 1143348599330585316414292419n),
        ]
      },
    })
    const exchangeQueryService = new ExchangeQueryService(
      uniswapV1Client,
      multicallClient
    )

    const results = await exchangeQueryService.getPrices(
      [{ token: DAI, exchange: Exchange.uniswapV3('weth', 3000) }],
      12345n
    )
    expect(results).toEqual([
      { liquidity: 4_000_000n, price: 208256305967085n },
    ])
  })

  it('correctly decodes multiple sets of requests', async () => {
    const uniswapV1Client = mock<UniswapV1Client>({
      async getExchangeAddresses(tokens) {
        expect(tokens).toEqual([TOKEN_A, TOKEN_B])
        return [EXCHANGE, undefined]
      },
    })
    const multicallClient = mock<MulticallClient>({
      async multicall(requests) {
        expect(requests).toEqual([
          ...encodeUniswapV2Requests(WETH, Exchange.uniswapV2('dai')),
          ...encodeUniswapV1Requests(TOKEN_A, new Map([[TOKEN_A, EXCHANGE]])),
          ...encodeUniswapV2Requests(WETH, Exchange.uniswapV2('usdt')),
          ...encodeUniswapV2Requests(WETH, Exchange.uniswapV2('usdc')),
        ])
        return [
          ...encodeUniswapV2Results(41_000n * 10n ** 18n, 10n * 10n ** 18n),
          ...encodeUniswapV1Results(10_000n, 20_000n),
          ...encodeUniswapV2Results(10n * 10n ** 18n, 42_000n * 10n ** 6n),
          ...encodeUniswapV2Results(43_000n * 10n ** 6n, 10n * 10n ** 18n),
        ]
      },
    })
    const exchangeQueryService = new ExchangeQueryService(
      uniswapV1Client,
      multicallClient
    )

    const results = await exchangeQueryService.getPrices(
      [
        { token: WETH, exchange: Exchange.uniswapV2('dai') },
        { token: TOKEN_A, exchange: Exchange.uniswapV1() },
        { token: TOKEN_B, exchange: Exchange.uniswapV1() },
        { token: WETH, exchange: Exchange.uniswapV2('usdt') },
        { token: WETH, exchange: Exchange.uniswapV2('usdc') },
      ],
      12345n
    )
    expect(results).toEqual([
      { liquidity: 10n * 10n ** 18n, price: 4100n * 10n ** 18n },
      { liquidity: 20_000n, price: 10n ** 18n / 2n },
      { liquidity: 0n, price: 0n },
      { liquidity: 10n * 10n ** 18n, price: 4200n * 10n ** 6n },
      { liquidity: 10n * 10n ** 18n, price: 4300n * 10n ** 6n },
    ])
  })
})
