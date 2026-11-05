import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import {
  ActivityHeadTracker,
  type HeadBlock,
  type HeadBlockSource,
} from './ActivityHeadTracker'

// Methodology: the stored counts reach block 100, the chain is mocked as a
// map of block number to hash, and each test reads what the tracker writes
const COUNTED = 100
const T0 = UnixTime.fromDate(new Date('2026-11-05T12:00:00Z'))

describe(ActivityHeadTracker.name, () => {
  it('follows the blocks above the counted ones up to the latest', async () => {
    const chain = mockChain(103)
    const db = mockDb()
    const tracker = createTracker(chain, db)

    await tracker.update()

    expect(written(db)).toEqual([101, 102, 103])
    expect(chain.getBlock).toHaveBeenCalledTimes(3)
  })

  it('fetches only the new blocks on the next update', async () => {
    const chain = mockChain(102)
    const db = mockDb()
    const tracker = createTracker(chain, db)
    await tracker.update()

    chain.latest = 104
    await tracker.update()

    expect(written(db)).toEqual([101, 102, 103, 104])
    expect(chain.getBlock).toHaveBeenCalledTimes(4)
  })

  it('drops the blocks the stored counts have reached since', async () => {
    const chain = mockChain(104)
    const db = mockDb()
    const tracker = createTracker(chain, db)
    await tracker.update()

    db.counted = 102
    await tracker.update()

    expect(written(db)).toEqual([103, 104])
  })

  it('refetches the blocks after a reorg, keeping the old ones meanwhile', async () => {
    const chain = mockChain(103)
    const db = mockDb()
    const tracker = createTracker(chain, db)
    await tracker.update()

    chain.reorgFrom(102)
    chain.latest = 104
    await tracker.update()
    // 104 does not link to the held 103, so nothing is published yet
    expect(hashes(db)).toEqual(['0x101', '0x102', '0x103'])

    await tracker.update()
    expect(hashes(db)).toEqual(['0x101', '0x102b', '0x103b', '0x104b'])
  })

  it('refetches when the newest block is replaced before another follows', async () => {
    const chain = mockChain(103)
    const db = mockDb()
    const tracker = createTracker(chain, db)
    await tracker.update()

    chain.reorgFrom(103)
    await tracker.update()
    expect(hashes(db)).toEqual(['0x101', '0x102', '0x103'])

    await tracker.update()
    expect(hashes(db)).toEqual(['0x101', '0x102', '0x103b'])
    // Only the replaced block is fetched again
    expect(chain.getBlock).toHaveBeenCalledTimes(4)
  })

  it('publishes nothing from nodes on different forks', async () => {
    // A load balancer can answer 102 from a fork and 103 from the canonical
    // chain. Their numbers run on, their hashes do not
    const chain = mockChain(103)
    chain.forkOnce(102)
    const db = mockDb()
    const tracker = createTracker(chain, db)

    await tracker.update()
    expect(db.replaceForProject).not.toHaveBeenCalled()

    await tracker.update()
    expect(hashes(db)).toEqual(['0x101', '0x102', '0x103'])
  })

  it('refetches from the counted blocks when they move back', async () => {
    // An invalidation restarts the counts below the held blocks, which then
    // would leave the blocks in between out
    const chain = mockChain(103)
    const db = mockDb()
    const tracker = createTracker(chain, db)
    await tracker.update()

    db.counted = 98
    await tracker.update()

    expect(written(db)).toEqual([99, 100, 101, 102, 103])
  })

  it('follows nothing while the counts are far behind the chain', async () => {
    // Backfilling, so the head would be a long way off
    const chain = mockChain(COUNTED + 10_000)
    const db = mockDb()
    const tracker = createTracker(chain, db)

    await tracker.update()

    expect(written(db)).toEqual([])
    expect(chain.getBlock).not.toHaveBeenCalled()
  })

  it('follows nothing before anything is counted', async () => {
    const chain = mockChain(103)
    const db = mockDb()
    db.counted = null
    const tracker = createTracker(chain, db)

    await tracker.update()

    expect(written(db)).toEqual([])
  })
})

function createTracker(chain: HeadBlockSource, db: ReturnType<typeof mockDb>) {
  return new ActivityHeadTracker(
    { projectId: ProjectId.ETHEREUM, source: chain, db: db.database },
    Logger.SILENT,
  )
}

function mockChain(latest: number) {
  let reorgedFrom = Number.POSITIVE_INFINITY
  const forkedOnce = new Set<number>()
  const hashOf = (number: number) =>
    `0x${number}${number >= reorgedFrom ? 'b' : ''}`
  const chain = {
    latest,
    reorgFrom(number: number) {
      reorgedFrom = number
    },
    forkOnce(number: number) {
      forkedOnce.add(number)
    },
    getLatestBlockNumber: mockFn(async () => chain.latest),
    getBlockHash: mockFn(async (number: number) => hashOf(number)),
    getBlock: mockFn(async (number: number): Promise<HeadBlock> => {
      const onFork = forkedOnce.delete(number)
      return {
        number,
        hash: onFork ? `0x${number}fork` : hashOf(number),
        parentHash: hashOf(number - 1),
        timestamp: T0 + number * 12,
        count: 10,
        uopsCount: 11,
      }
    }),
  }
  return chain
}

function mockDb() {
  const state = {
    counted: COUNTED as number | null,
    database: undefined as unknown as Database,
    replaceForProject: mockFn().resolvesTo(undefined),
  }
  state.database = mockDatabase({
    syncMetadata: mockObject<Database['syncMetadata']>({
      getByFeatureAndId: async () =>
        state.counted === null
          ? undefined
          : {
              feature: 'activity',
              id: 'ethereum',
              target: T0,
              syncedUntil: T0,
              blockTarget: state.counted,
              blockSyncedUntil: state.counted,
              latestBlockTimestamp: T0,
            },
    }),
    activityHeadBlock: mockObject<Database['activityHeadBlock']>({
      replaceForProject: state.replaceForProject,
    }),
  })
  return state
}

function writtenBlocks(db: ReturnType<typeof mockDb>) {
  const calls = db.replaceForProject.calls
  return (calls.at(-1)?.args[1] ?? []) as HeadBlock[]
}

function hashes(db: ReturnType<typeof mockDb>) {
  return writtenBlocks(db).map((b) => b.hash)
}

function written(db: ReturnType<typeof mockDb>) {
  return writtenBlocks(db).map((b) => b.number)
}
