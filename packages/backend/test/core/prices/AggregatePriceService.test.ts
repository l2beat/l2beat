import { AssetId, EthereumAddress, Exchange, Logger } from '@l2beat/common'
import { expect } from 'earljs'

import { AggregatePriceService } from '../../../src/core/prices/AggregatePriceService'
import { ExchangePriceService } from '../../../src/core/prices/ExchangePriceService'
import { Token } from '../../../src/model'
import { AggregatePriceRepository } from '../../../src/peripherals/database/AggregatePriceRepository'
import { mock } from '../../mock'

describe(AggregatePriceService.name, () => {
  it('does nothing when no tokens are given', async () => {
    const aggregatePriceRepository = mock<AggregatePriceRepository>()
    const exchangePriceService = mock<ExchangePriceService>()
    const aggregatePriceService = new AggregatePriceService(
      aggregatePriceRepository,
      exchangePriceService,
      Logger.SILENT
    )
    await expect(
      aggregatePriceService.updateAggregatePrices([], 0n)
    ).not.toBeRejected()
  })

  it('adds new entries and updates existing ones', async () => {
    const tokens: Token[] = [
      {
        id: AssetId('aaa-token'),
        address: EthereumAddress('0x' + 'a'.repeat(40)),
        decimals: 18,
        symbol: 'AAA',
        priceStrategy: { type: 'market' },
      },
      {
        id: AssetId('stable-token'),
        address: EthereumAddress('0x' + '1'.repeat(40)),
        decimals: 18,
        symbol: 'STB',
        priceStrategy: { type: 'constant', value: 123n * 10n ** 18n },
      },
    ]
    const blockNumber = 1234n

    let calledUpdate = false

    const aggregatePriceRepository = mock<AggregatePriceRepository>({
      async getAllByBlockNumber(block) {
        expect(block).toEqual(blockNumber)
        return [
          {
            assetId: AssetId('stable-token'),
            priceUsd: 123n * 10n ** 18n,
            blockNumber,
          },
          {
            assetId: AssetId('ether'),
            priceUsd: 4000n * 10n ** 18n,
            blockNumber,
          },
        ]
      },
      async addOrUpdate(records) {
        calledUpdate = true
        expect(records).toEqual([
          {
            assetId: AssetId('aaa-token'),
            priceUsd: 20n * 10n ** 18n,
            blockNumber,
          },
          {
            assetId: AssetId('ether'),
            priceUsd: 4123n * 10n ** 18n,
            blockNumber,
          },
        ])
      },
    })
    const exchangePriceService = mock<ExchangePriceService>({
      async updateExchangePrices(tokensToUpdate, block) {
        expect(block).toEqual(blockNumber)
        expect(tokensToUpdate).toEqual(tokens)
        return [
          {
            assetId: AssetId.WETH,
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 42069n * 10n ** 18n,
            price: 4123n * 10n ** 18n,
          },
          {
            assetId: AssetId('aaa-token'),
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 1337n * 10n ** 18n,
            price: 20n * 10n ** 18n,
          },
        ]
      },
    })
    const aggregatePriceService = new AggregatePriceService(
      aggregatePriceRepository,
      exchangePriceService,
      Logger.SILENT
    )
    await aggregatePriceService.updateAggregatePrices(tokens, blockNumber)
    expect(calledUpdate).toEqual(true)
  })

  it('does nothing when all prices remain the same', async () => {
    const tokens: Token[] = [
      {
        id: AssetId('aaa-token'),
        address: EthereumAddress('0x' + 'a'.repeat(40)),
        decimals: 18,
        symbol: 'AAA',
        priceStrategy: { type: 'market' },
      },
    ]
    const blockNumber = 1234n

    let calledUpdate = false

    const aggregatePriceRepository = mock<AggregatePriceRepository>({
      async getAllByBlockNumber(block) {
        expect(block).toEqual(blockNumber)
        return [
          {
            assetId: AssetId('aaa-token'),
            priceUsd: 20n * 10n ** 18n,
            blockNumber,
          },
          {
            assetId: AssetId('ether'),
            priceUsd: 4000n * 10n ** 18n,
            blockNumber,
          },
        ]
      },
      async addOrUpdate() {
        calledUpdate = true
      },
    })
    const exchangePriceService = mock<ExchangePriceService>({
      async updateExchangePrices(tokensToUpdate, block) {
        expect(block).toEqual(blockNumber)
        expect(tokensToUpdate).toEqual(tokens)
        return [
          {
            assetId: AssetId.WETH,
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 42069n * 10n ** 18n,
            price: 4000n * 10n ** 18n,
          },
          {
            assetId: AssetId('aaa-token'),
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 1337n * 10n ** 18n,
            price: 20n * 10n ** 18n,
          },
        ]
      },
    })
    const aggregatePriceService = new AggregatePriceService(
      aggregatePriceRepository,
      exchangePriceService,
      Logger.SILENT
    )
    await aggregatePriceService.updateAggregatePrices(tokens, blockNumber)
    expect(calledUpdate).toEqual(false)
  })
})
