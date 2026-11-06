import { Logger } from '@l2beat/backend-tools'
import type { Database, LiveActivityBlockRecord } from '@l2beat/database'
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
    it('reads stored blocks without fetching them', async () => {
      const fallback = mockFallback()
      const source = createSource([1, 2, 3], fallback)

      const blocks = await source.getBlocks(1, 3)

      expect(blocks).toEqual([stored(1), stored(2), stored(3)])
      expect(fallback.getBlocks).not.toHaveBeenCalled()
    })

    it('fetches the blocks before, between and after the stored ones', async () => {
      const fallback = mockFallback()
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

    it('fetches stored blocks a reorg replaced while the follower was down', async () => {
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
      const fallback = mockFallback()
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

function mockFallback() {
  return mockObject<ActivityBlockSource>({
    getBlocks: mockFn(async (from: number, to: number) =>
      range(from, to + 1).map(fetched),
    ),
  })
}

function stored(number: number): ActivityBlock {
  return { number, timestamp: T0 + number, txsCount: 10, uopsCount: 11 }
}

function fetched(number: number): ActivityBlock {
  return { number, timestamp: T0 + number, txsCount: 1, uopsCount: null }
}
