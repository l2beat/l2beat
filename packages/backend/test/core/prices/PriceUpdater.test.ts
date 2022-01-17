import { expect } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { BlockNumberUpdater } from '../../../src/core/BlockNumberUpdater'
import { AggregatePriceService } from '../../../src/core/prices/AggregatePriceService'
import { PriceUpdater } from '../../../src/core/prices/PriceUpdater'
import { AssetId, EthereumAddress, Token, UnixTime } from '../../../src/model'
import { BlockNumberRecord } from '../../../src/peripherals/database/BlockNumberRepository'
import { Logger } from '../../../src/tools/Logger'
import { mock } from '../../mock'

describe(PriceUpdater.name, () => {
  const tokens: Token[] = [
    {
      id: AssetId('aaa-token'),
      address: EthereumAddress('0x' + 'a'.repeat(40)),
      symbol: 'AAA',
      decimals: 5,
      priceStrategy: { type: 'market' },
    },
    {
      id: AssetId('bbb-token'),
      address: EthereumAddress('0x' + 'b'.repeat(40)),
      symbol: 'BBB',
      decimals: 7,
      priceStrategy: { type: 'market' },
    },
  ]

  it('schedules initial tasks', async () => {
    const blockNumberUpdater = mock<BlockNumberUpdater>({
      getBlockList() {
        return [
          { timestamp: new UnixTime(123), blockNumber: 400n },
          { timestamp: new UnixTime(456), blockNumber: 600n },
        ]
      },
      onNewBlocks() {
        return () => {}
      },
    })
    const calls: { tokens: Token[]; blockNumber: bigint }[] = []
    const aggregatePriceService = mock<AggregatePriceService>({
      async updateAggregatePrices(tokens, blockNumber) {
        calls.push({ tokens, blockNumber })
      },
    })
    const priceUpdater = new PriceUpdater(
      tokens,
      blockNumberUpdater,
      aggregatePriceService,
      Logger.SILENT
    )
    await priceUpdater.start()
    await waitForExpect(() => {
      expect(calls.length).toEqual(2)
    })
    expect(calls).toEqual([
      { tokens, blockNumber: 400n },
      { tokens, blockNumber: 600n },
    ])
  })

  it('adds new tasks for new blocks', async () => {
    let onNewBlock: (blocks: BlockNumberRecord[]) => void = () => {}
    const blockNumberUpdater = mock<BlockNumberUpdater>({
      getBlockList() {
        return []
      },
      onNewBlocks(fn) {
        onNewBlock = fn
        return () => {}
      },
    })
    const calls: { tokens: Token[]; blockNumber: bigint }[] = []
    const aggregatePriceService = mock<AggregatePriceService>({
      async updateAggregatePrices(tokens, blockNumber) {
        calls.push({ tokens, blockNumber })
      },
    })
    const priceUpdater = new PriceUpdater(
      tokens,
      blockNumberUpdater,
      aggregatePriceService,
      Logger.SILENT
    )
    await priceUpdater.start()

    onNewBlock([{ timestamp: new UnixTime(123), blockNumber: 400n }])
    onNewBlock([{ timestamp: new UnixTime(456), blockNumber: 600n }])

    await waitForExpect(() => {
      expect(calls.length).toEqual(2)
    })
    expect(calls).toEqual([
      { tokens, blockNumber: 400n },
      { tokens, blockNumber: 600n },
    ])
  })
})
