import { expect } from 'chai'

import { AggregatePriceUpdater } from '../../../src/core/prices/AggregatePriceUpdater'
import { ExchangePriceUpdater } from '../../../src/core/prices/ExchangePriceUpdater'
import { EthereumAddress, Exchange, Token } from '../../../src/model'
import { AggregatePriceRepository } from '../../../src/peripherals/database/AggregatePriceRepository'
import { Logger } from '../../../src/tools/Logger'
import { mock } from '../../mock'

describe('AggregatePriceUpdater', () => {
  it('does nothing when no tokens are given', async () => {
    const aggregatePriceRepository = mock<AggregatePriceRepository>()
    const exchangePriceUpdater = mock<ExchangePriceUpdater>()
    const aggregatePriceUpdater = new AggregatePriceUpdater(
      aggregatePriceRepository,
      exchangePriceUpdater,
      Logger.SILENT
    )
    await expect(aggregatePriceUpdater.updateAggregatePrices([], 0n)).not.to.be
      .rejected
  })

  it('adds new entries and updates existing ones', async () => {
    const tokens: Token[] = [
      {
        id: 'aaa-token',
        address: EthereumAddress('0x' + 'a'.repeat(40)),
        decimals: 18,
        symbol: 'AAA',
        priceStrategy: { type: 'market' },
      },
      {
        id: 'stable-token',
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
        expect(block).to.equal(blockNumber)
        return [
          { assetId: 'stable-token', priceUsd: 123n * 10n ** 18n, blockNumber },
          { assetId: 'ether', priceUsd: 4000n * 10n ** 18n, blockNumber },
        ]
      },
      async addOrUpdate(records) {
        calledUpdate = true
        expect(records).to.deep.equal([
          { assetId: 'aaa-token', priceUsd: 20n * 10n ** 18n, blockNumber },
          { assetId: 'ether', priceUsd: 4123n * 10n ** 18n, blockNumber },
        ])
      },
    })
    const exchangePriceUpdater = mock<ExchangePriceUpdater>({
      async updateExchangePrices(tokensToUpdate, block) {
        expect(block).to.equal(blockNumber)
        expect(tokensToUpdate).to.equal(tokens)
        return [
          {
            assetId: 'wrapped-ether',
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 42069n * 10n ** 18n,
            price: 4123n * 10n ** 18n,
          },
          {
            assetId: 'aaa-token',
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 1337n * 10n ** 18n,
            price: 20n * 10n ** 18n,
          },
        ]
      },
    })
    const aggregatePriceUpdater = new AggregatePriceUpdater(
      aggregatePriceRepository,
      exchangePriceUpdater,
      Logger.SILENT
    )
    await aggregatePriceUpdater.updateAggregatePrices(tokens, blockNumber)
    expect(calledUpdate).to.equal(true)
  })

  it('does nothing when all prices remain the same', async () => {
    const tokens: Token[] = [
      {
        id: 'aaa-token',
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
        expect(block).to.equal(blockNumber)
        return [
          { assetId: 'aaa-token', priceUsd: 20n * 10n ** 18n, blockNumber },
          { assetId: 'ether', priceUsd: 4000n * 10n ** 18n, blockNumber },
        ]
      },
      async addOrUpdate() {
        calledUpdate = true
      },
    })
    const exchangePriceUpdater = mock<ExchangePriceUpdater>({
      async updateExchangePrices(tokensToUpdate, block) {
        expect(block).to.equal(blockNumber)
        expect(tokensToUpdate).to.equal(tokens)
        return [
          {
            assetId: 'wrapped-ether',
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 42069n * 10n ** 18n,
            price: 4000n * 10n ** 18n,
          },
          {
            assetId: 'aaa-token',
            blockNumber,
            exchange: Exchange.uniswapV2('dai'),
            liquidity: 1337n * 10n ** 18n,
            price: 20n * 10n ** 18n,
          },
        ]
      },
    })
    const aggregatePriceUpdater = new AggregatePriceUpdater(
      aggregatePriceRepository,
      exchangePriceUpdater,
      Logger.SILENT
    )
    await aggregatePriceUpdater.updateAggregatePrices(tokens, blockNumber)
    expect(calledUpdate).to.equal(false)
  })
})
