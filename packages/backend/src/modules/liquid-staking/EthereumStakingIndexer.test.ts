import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { slotAt, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import type { ExecutionDayDune } from './duneExecutionDay'
import { EthereumStakingIndexer } from './EthereumStakingIndexer'

describe(EthereumStakingIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const day = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

  it('stores the day that ends at the next height', async () => {
    const { indexer, daily, beacon, rpc, dune } = createIndexer()

    // The previous height is the end of a stored day, `day`.
    expect(await indexer.update(day + 1, day + 5 * UnixTime.DAY)).toEqual(
      day + UnixTime.DAY,
    )

    expect(beacon.getTotalBalance).toHaveBeenOnlyCalledWith(slotAt(day))
    expect(beacon.getForkAndDepositIndex.calls.map((c) => c.args)).toEqual([
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
    expect(dune.query.calls[0]?.args[0]).toInclude(
      `between ${day + 1} and ${day + UnixTime.DAY}`,
    )
    expect(daily.upsertMany).toHaveBeenOnlyCalledWith([
      {
        timestamp: day,
        slot: slotAt(day),
        totalBalance: 100n,
        activeBalance: 90n,
        pendingDeposits: null,
        withdrawals: 0n,
        deposits: 0n,
        builderPayments: 0n,
        priorityFees: 0n,
        directTransfers: 0n,
        blockCount: UnixTime.DAY,
        builderBlockCount: 0,
      },
    ])
  })

  it('stores the first day on the first update, from minHeight', async () => {
    const { indexer, daily } = createIndexer()
    const minHeight = day + UnixTime.DAY

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
    beacon.getForkAndDepositIndex.resolvesTo({
      forkVersion: '0x07000000',
      depositIndex: 5,
    })

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
    getForkAndDepositIndex: mockFn().resolvesTo({
      forkVersion: '0x03000000',
      depositIndex: 5,
    }),
    getPendingDepositsAmount: mockFn().resolvesTo(7n),
  }
  const rpc = { getLogs: mockFn().resolvesTo([]) }
  // A complete day of empty sums for the blocks asked about;
  // readExecutionDayFromDune has its own tests.
  const dune = mockObject<ExecutionDayDune>({
    query: async (sql, _performance, schema) => {
      const [from, to] = (sql.match(/number between (\d+) and (\d+)/) ?? [])
        .slice(1)
        .map(Number)
      return schema.parse([
        {
          blocks: (to ?? 0) - (from ?? 0) + 1,
          first_block: from,
          last_block: to,
          incomplete_blocks: 0,
          builder_blocks: 0,
          large_builder_payment_blocks: null,
          builder_payments: '0',
          priority_fees: '0',
          direct_transfers: '0',
          withdrawal_count: 2,
          withdrawal_span: 2,
          first_withdrawal_block: from,
          last_withdrawal_block: to,
          withdrawals_gwei: '0',
        },
      ])
    },
  })
  const indexer = new EthereumStakingIndexer(
    {
      parents: [],
      indexerService: mockObject<IndexerService>(),
      minHeight: UnixTime.fromDate(new Date('2024-01-02T00:00:00Z')),
      db: mockDatabase({ ethereumStakingDaily: daily }),
      rpc,
      dune,
      beacon,
      // The block number stands in for the timestamp it was looked up for.
      blockTimestampProvider: {
        getBlockNumberAtOrBefore: mockFn(async (timestamp: UnixTime) =>
          Number(timestamp),
        ),
      },
    },
    Logger.SILENT,
  )
  return { indexer, daily, beacon, rpc, dune }
}
