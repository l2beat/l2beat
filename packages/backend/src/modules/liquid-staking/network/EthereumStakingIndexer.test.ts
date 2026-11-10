import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { slotAt, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { EthereumStakingIndexer } from './EthereumStakingIndexer'

describe(EthereumStakingIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const day = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

  it('stores the day that ends at the next height', async () => {
    const { indexer, daily, beacon, rpc, readExecutionDay } = createIndexer()

    // The previous height is the end of a stored day, `day`.
    expect(await indexer.update(day + 1, day + 5 * UnixTime.DAY)).toEqual(
      day + UnixTime.DAY,
    )

    expect(beacon.getTotalBalance).toHaveBeenOnlyCalledWith(slotAt(day))
    expect(beacon.getDepositIndex.calls.map((c) => c.args)).toEqual([
      [slotAt(day)],
      [slotAt(day + UnixTime.DAY)],
    ])
    // Before Electra there is no pending deposit queue.
    expect(beacon.getPendingDepositsAmount).not.toHaveBeenCalled()
    // From the first block at or after the day to the last before the next.
    expect(rpc.getLogs.calls[0]?.args.slice(0, 2)).toEqual([
      day + 1,
      day + UnixTime.DAY,
    ])
    expect(readExecutionDay).toHaveBeenOnlyCalledWith(
      day,
      day + 1,
      day + UnixTime.DAY,
    )
    expect(daily.upsertMany).toHaveBeenOnlyCalledWith([
      {
        timestamp: day,
        slot: slotAt(day),
        totalBalance: 100n,
        activeBalance: 90n,
        pendingDeposits: null,
        deposits: 0n,
        ...EXECUTION_DAY,
      },
    ])
  })

  it('stores the first day on the first update', async () => {
    const { indexer, daily } = createIndexer()
    const { minHeight } = indexer.options

    expect(
      await indexer.update(minHeight, minHeight + 5 * UnixTime.DAY),
    ).toEqual(minHeight)
    expect(daily.upsertMany.calls[0]?.args[0]?.[0]?.timestamp).toEqual(day)
  })

  it('reads the pending deposits from Electra on', async () => {
    const { indexer, beacon } = createIndexer()
    const afterElectra = UnixTime.fromDate(new Date('2025-06-01T00:00:00Z'))

    await indexer.update(afterElectra - UnixTime.DAY + 1, afterElectra)

    expect(beacon.getPendingDepositsAmount).toHaveBeenOnlyCalledWith(
      slotAt(afterElectra - UnixTime.DAY),
    )
  })

  it('fails on a day in a fork it does not know', async () => {
    const { indexer, beacon } = createIndexer()
    beacon.getForkVersion.resolvesTo('0x07000000')

    await expect(indexer.update(day + 1, day + UnixTime.DAY)).toBeRejectedWith(
      'Unsupported Ethereum fork',
    )
  })

  it('keeps only the days that end by the invalidated height', async () => {
    const { indexer, daily } = createIndexer()

    expect(await indexer.invalidate(day + 3 * UnixTime.DAY)).toEqual(
      day + 3 * UnixTime.DAY,
    )
    expect(daily.deleteAfter).toHaveBeenOnlyCalledWith(
      UnixTime(day + 2 * UnixTime.DAY),
    )
  })
})

const EXECUTION_DAY = {
  withdrawals: 1n,
  builderPayments: 2n,
  priorityFees: 3n,
  directTransfers: 4n,
  blockCount: 7200,
  builderBlockCount: 6000,
}

function createIndexer() {
  const daily = mockObject<Database['ethereumStakingDaily']>({
    upsertMany: mockFn().resolvesTo(1),
    deleteAfter: mockFn().resolvesTo(0),
  })
  const beacon = {
    getTotalBalance: mockFn().resolvesTo(100n),
    getValidatorsInfo: mockFn().resolvesTo({
      totalStake: 10n,
      numberOfValidators: 1,
    }),
    getForkVersion: mockFn().resolvesTo('0x03000000'),
    getDepositIndex: mockFn().resolvesTo(5),
    getPendingDepositsAmount: mockFn().resolvesTo(7n),
  }
  const rpc = { getLogs: mockFn().resolvesTo([]) }
  const readExecutionDay = mockFn().resolvesTo(EXECUTION_DAY)
  const indexer = new EthereumStakingIndexer(
    {
      parents: [],
      indexerService: mockObject<IndexerService>(),
      firstDay: UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
      db: mockDatabase({ ethereumStakingDaily: daily }),
      rpc,
      readExecutionDay,
      beacon,
      // The block number stands in for the timestamp it was looked up for.
      blockFinder: {
        getBlockNumberAtOrBefore: mockFn(async (timestamp: UnixTime) =>
          Number(timestamp),
        ),
      },
    },
    Logger.SILENT,
  )
  return { indexer, daily, beacon, rpc, readExecutionDay }
}
