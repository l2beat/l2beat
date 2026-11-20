import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  LiveActivityBlockRecord,
  LiveCheckRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import range from 'lodash/range'
import { mockDatabase } from '../../../test/database'
import type { ActivityBlockSource } from '../indexers/types'
import type { ActivityBlock } from '../services/txs/types'
import { type BlockHashSource, StoredBlockSource } from './StoredBlockSource'

const PROJECT = ProjectId('base')
const T0 = UnixTime.fromDate(new Date('2026-11-06T12:00:00Z'))

describe(StoredBlockSource.name, () => {
  describe(StoredBlockSource.prototype.getBlocks.name, () => {
    it('reads stored blocks, fetching only the newest to count it afresh', async () => {
      const fallback = mockFallback([1, 2, 3])
      const checks: LiveCheckRecord[] = []
      const source = createSource([1, 2, 3], fallback, { checks })

      const blocks = await source.getBlocks(1, 3)

      expect(blocks).toEqual([stored(1), stored(2), stored(3)])
      expect(fallback.getBlocks).toHaveBeenOnlyCalledWith(3, 3)
      expect(checks.map((c) => [c.feature, c.chain, c.status])).toEqual([
        ['activity', PROJECT, 'match'],
      ])
    })

    it('fetches every block when the newest stored one counts differently afresh, and stores that', async () => {
      // the fallback counts every block as 1, the stored ones say 10
      const fallback = mockFallback()
      const checks: LiveCheckRecord[] = []
      const source = createSource([1, 2, 3], fallback, { checks })

      const blocks = await source.getBlocks(1, 3)

      expect(blocks).toEqual([fetched(1), fetched(2), fetched(3)])
      expect(checks).toEqual([
        {
          feature: 'activity',
          chain: PROJECT,
          from: UnixTime.toStartOf(T0, 'day'),
          to: UnixTime.toStartOf(T0, 'day') + UnixTime.DAY,
          status: 'mismatch',
          compared: 1,
          missing: 0,
          extra: 0,
          changed: 1,
          checkedAt: expect.a(Number),
        },
      ])
    })

    it('keeps fetching every block while a mismatch of the project is stored', async () => {
      const fallback = mockFallback([1, 2, 3])
      const source = createSource([1, 2, 3], fallback, { mismatched: true })

      const blocks = await source.getBlocks(1, 3)

      expect(blocks).toEqual([stored(1), stored(2), stored(3)])
      // all three from the fallback, which here counts them as the stored ones do
      expect(fallback.getBlocks).toHaveBeenOnlyCalledWith(1, 3)
    })

    it('reads stored blocks again once the mismatch is deleted', async () => {
      const fallback = mockFallback([1, 2, 3])
      const options = { mismatched: true }
      const source = createSource([1, 2, 3], fallback, options)
      await source.getBlocks(1, 3)

      options.mismatched = false
      await source.getBlocks(1, 3)

      expect(fallback.getBlocks.calls.map((c) => c.args)).toEqual([
        [1, 3],
        // the newest stored block alone, counted afresh
        [3, 3],
      ])
    })

    it('reads on from the stored blocks when none can be counted afresh', async () => {
      const fallback = mockObject<ActivityBlockSource>({
        getBlocks: mockFn().rejectsWith(new Error('RPC down')),
      })
      const checks: LiveCheckRecord[] = []
      const source = createSource([1, 2, 3], fallback, { checks })

      const blocks = await source.getBlocks(1, 3)

      expect(blocks).toEqual([stored(1), stored(2), stored(3)])
      expect(checks).toEqual([])
    })

    it('fetches the blocks before, between and after the stored ones', async () => {
      const fallback = mockFallback([3, 4, 6])
      const source = createSource([3, 4, 6], fallback)

      const blocks = await source.getBlocks(1, 8)

      expect(blocks).toEqual([
        fetched(1),
        fetched(2),
        stored(3),
        stored(4),
        fetched(5),
        stored(6),
        fetched(7),
        fetched(8),
      ])
      expect(fallback.getBlocks.calls.map((c) => c.args)).toEqual([
        // the newest stored block, counted afresh
        [6, 6],
        [1, 2],
        [5, 5],
        [7, 8],
      ])
    })

    it('fetches the whole range when nothing is stored', async () => {
      const fallback = mockFallback()
      const source = createSource([], fallback)

      const blocks = await source.getBlocks(1, 2)

      expect(blocks).toEqual([fetched(1), fetched(2)])
      expect(fallback.getBlocks).toHaveBeenOnlyCalledWith(1, 2)
    })

    it('fetches stored blocks a reorg replaced while the chain head was down', async () => {
      // Methodology: blocks 1-3 were stored, then a reorg replaced 3, and so
      // 1 and 2 too as far as the stored run can tell
      const fallback = mockFallback()
      const source = createSource([1, 2, 3], fallback, { replaced: [3] })

      const blocks = await source.getBlocks(1, 3)

      expect(blocks).toEqual([fetched(1), fetched(2), fetched(3)])
      expect(fallback.getBlocks).toHaveBeenOnlyCalledWith(1, 3)
    })

    it('fetches stored blocks it cannot check against the chain', async () => {
      const fallback = mockFallback()
      const hashes = mockObject<BlockHashSource>({
        getBlockHash: mockFn().rejectsWith(new Error('RPC down')),
      })
      const source = createSource([1, 2], fallback, { hashes })

      const blocks = await source.getBlocks(1, 2)

      expect(blocks).toEqual([fetched(1), fetched(2)])
      expect(fallback.getBlocks).toHaveBeenOnlyCalledWith(1, 2)
    })

    it('checks each run of linked blocks against the chain once', async () => {
      // 1-2 link up, 3 does not link to 2, and 5 is apart from 3
      const fallback = mockFallback([1, 2, 5])
      const hashes = mockHashes({ replaced: [3] })
      const source = createSource([1, 2, 3, 5], fallback, {
        unlinked: [3],
        hashes,
      })

      const blocks = await source.getBlocks(1, 5)

      expect(blocks).toEqual([
        stored(1),
        stored(2),
        fetched(3),
        fetched(4),
        stored(5),
      ])
      expect(hashes.getBlockHash.calls.map((c) => c.args)).toEqual([
        [2],
        [3],
        [5],
      ])
    })
  })
})

function createSource(
  numbers: number[],
  fallback: ActivityBlockSource,
  options: {
    /** Stored blocks the chain has replaced since */
    replaced?: number[]
    /** Stored blocks whose parent is not the stored block before them */
    unlinked?: number[]
    hashes?: BlockHashSource
    /** Gets the results of counting a stored block afresh */
    checks?: LiveCheckRecord[]
    /** A mismatch of the project is stored from an earlier read */
    mismatched?: boolean
  } = {},
) {
  const records = numbers.map(
    (number): LiveActivityBlockRecord => ({
      projectId: PROJECT,
      number,
      hash: `0x${number}`,
      parentHash: options.unlinked?.includes(number)
        ? '0xother'
        : `0x${number - 1}`,
      timestamp: T0 + number,
      count: 10,
      uopsCount: 11,
      gasUsed: 21_000,
    }),
  )
  const db = mockDatabase({
    liveActivityBlock: mockObject<Database['liveActivityBlock']>({
      getByProjectNumberRange: async (_, from, to) =>
        records.filter((r) => r.number >= from && r.number <= to),
    }),
    liveCheck: mockObject<Database['liveCheck']>({
      getChainsWith: async () => (options.mismatched ? [PROJECT] : []),
      upsert: async (record) => {
        options.checks?.push(record)
      },
    }),
  })
  const hashes = options.hashes ?? mockHashes({ replaced: options.replaced })
  return new StoredBlockSource(
    { projectId: PROJECT, db, fallback, hashes },
    Logger.SILENT,
  )
}

function mockHashes({ replaced = [] }: { replaced?: number[] }) {
  return mockObject<BlockHashSource>({
    getBlockHash: mockFn(async (number: number) =>
      replaced.includes(number) ? `0x${number}b` : `0x${number}`,
    ),
  })
}

/** Counts the given blocks as the stored ones were counted, and every other block as 1 */
function mockFallback(countedAsStored: number[] = []) {
  return mockObject<ActivityBlockSource>({
    getBlocks: mockFn(async (from: number, to: number) =>
      range(from, to + 1).map((number) =>
        countedAsStored.includes(number) ? stored(number) : fetched(number),
      ),
    ),
  })
}

function stored(number: number): ActivityBlock {
  return { number, timestamp: T0 + number, txsCount: 10, uopsCount: 11 }
}

function fetched(number: number): ActivityBlock {
  return { number, timestamp: T0 + number, txsCount: 1, uopsCount: null }
}
