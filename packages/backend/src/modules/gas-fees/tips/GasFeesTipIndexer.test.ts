import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { EVMFeeHistory } from '@l2beat/shared'
import { Bytes, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { GasFeesTipIndexer } from './GasFeesTipIndexer'

describe(GasFeesTipIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const firstHour = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))

  it('stores each hour from the 1,800 blocks before it', async () => {
    const { indexer, hourly, rpc } = createIndexer()

    expect(
      await indexer.update(firstHour, firstHour + 2 * UnixTime.HOUR),
    ).toEqual(firstHour + 2 * UnixTime.HOUR)

    // 300 blocks an hour, so 2,400 blocks for three hours
    expect(rpc.getFeeHistory.calls.map((c) => c.args.slice(0, 2))).toEqual([
      [1024, 10_600],
      [1024, 9_576],
      [352, 8_552],
    ])
    const records = hourly.upsertMany.calls[0]?.args[0] ?? []
    expect(records.map((r) => [r.timestamp, r.blockNumber])).toEqual([
      [firstHour, 10_000],
      [firstHour + UnixTime.HOUR, 10_300],
      [firstHour + 2 * UnixTime.HOUR, 10_600],
    ])
    // Block n tips n wei: fast is the 99th percentile of the 1,800 blocks up to the hour
    expect(records[2]?.fastTipGwei).toEqual((10_600 - 1800 + 1 + 1782) / 1e9)
    expect(records[2]?.ethUsd).toEqual(4000)
  })

  function createIndexer() {
    const hourly = mockObject<Database['gasFeesTipHourly']>({
      upsertMany: mockFn().resolvesTo(0),
    })
    // A block every 12 s, block 10,000 the last before firstHour
    const blockAt = (t: number) => 10_000 + Math.floor((t - firstHour) / 12)
    const rpc = {
      getFeeHistory: mockFn(
        async (count: number, newest: number): Promise<EVMFeeHistory> => ({
          oldestBlock: newest - count + 1,
          baseFeePerGas: [],
          gasUsedRatio: [],
          baseFeePerBlobGas: [],
          blobGasUsedRatio: [],
          reward: Array.from({ length: count }, (_, i) => {
            const n = BigInt(newest - count + 1 + i)
            return [n, n]
          }),
        }),
      ),
      call: mockFn().resolvesTo(
        Bytes.fromHex((4000n * 10n ** 8n).toString(16).padStart(64, '0')),
      ),
      getBlockTimestamp: mockFn(
        async (n: number) => firstHour - 6 + (n - 10_000) * 12,
      ),
    }
    const indexer = new GasFeesTipIndexer(
      {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        firstHour,
        db: mockDatabase({ gasFeesTipHourly: hourly }),
        rpc,
        blockFinder: {
          getBlockNumberAtOrBefore: mockFn(async (t: UnixTime) => blockAt(t)),
        },
      },
      Logger.SILENT,
    )
    return { indexer, hourly, rpc }
  }
})
