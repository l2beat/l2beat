import { expect } from 'chai'

import { EthereumAddress } from '../../../src/model'
import { MulticallClient } from '../../../src/peripherals/ethereum/MulticallClient'
import { ExchangePriceChecker } from '../../../src/peripherals/exchanges/ExchangePriceChecker'
import { DAI } from '../../../src/peripherals/exchanges/queries/constants'
import { encodeUniswapV1Requests } from '../../../src/peripherals/exchanges/queries/uniswapV1'
import { encodeUniswapV2Requests } from '../../../src/peripherals/exchanges/queries/uniswapV2'
import { UniswapV1Client } from '../../../src/peripherals/exchanges/UniswapV1Client'
import { mock } from '../../mock'
import { encodeUniswapV1Results, encodeUniswapV2Results } from './queries/utils'

describe('ExchangePriceChecker', () => {
  const TOKEN_A = new EthereumAddress('0x' + 'a'.repeat(40))
  const TOKEN_B = new EthereumAddress('0x' + 'b'.repeat(40))
  const EXCHANGE = new EthereumAddress('0x' + 'c'.repeat(40))

  it('supports Uniswap V1', async () => {
    const uniswapV1Client = mock<UniswapV1Client>({
      async getExchangeAddresses(tokens) {
        expect(tokens).to.deep.equal([TOKEN_A, TOKEN_B])
        return [EXCHANGE, undefined]
      },
    })
    const multicallClient = mock<MulticallClient>({
      async multicall(requests, blockNumber) {
        expect(requests).to.deep.equal([
          ...encodeUniswapV1Requests(TOKEN_A, new Map([[TOKEN_A, EXCHANGE]])),
        ])
        expect(blockNumber).to.deep.equal(12345n)
        return [...encodeUniswapV1Results(10_000n, 20_000n)]
      },
    })
    const exchangePriceChecker = new ExchangePriceChecker(
      uniswapV1Client,
      multicallClient
    )

    const results = await exchangePriceChecker.getPrices(
      [
        { token: TOKEN_A, exchange: 'uniswap-v1' },
        { token: TOKEN_B, exchange: 'uniswap-v1' },
      ],
      12345n
    )
    expect(results).to.deep.equal([
      { liquidity: 20_000n, price: 10n ** 18n / 2n },
      { liquidity: 0n, price: 0n },
    ])
  })

  it('supports Uniswap V2', async () => {
    const uniswapV1Client = mock<UniswapV1Client>()
    const multicallClient = mock<MulticallClient>({
      async multicall(requests, blockNumber) {
        expect(requests).to.deep.equal([
          ...encodeUniswapV2Requests(DAI, 'uniswap-v2-weth'),
        ])
        expect(blockNumber).to.deep.equal(12345n)
        return [...encodeUniswapV2Results(4_000_000n, 1_000n)]
      },
    })
    const exchangePriceChecker = new ExchangePriceChecker(
      uniswapV1Client,
      multicallClient
    )

    const results = await exchangePriceChecker.getPrices(
      [{ token: DAI, exchange: 'uniswap-v2-weth' }],
      12345n
    )
    expect(results).to.deep.equal([
      { liquidity: 4_000_000n, price: 10n ** 18n / 4_000n },
    ])
  })
})
