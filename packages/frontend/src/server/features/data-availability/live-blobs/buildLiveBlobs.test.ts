import type { LiveBlobBatchRecord, LiveBlockRecord } from '@l2beat/database'
import { ProjectId, slotStart, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  buildLiveBlobs,
  buildPastBlobs,
  type LiveBlobsRows,
} from './buildLiveBlobs'
import {
  BELT_SLOTS,
  BUCKET_SLOTS,
  BUCKETS,
  PULSE_BUCKET_SLOTS,
  PULSE_BUCKETS,
  WINDOW_SLOTS,
} from './liveBlobsSlots'

// Methodology: rows shaped as the database returns them for a head at slot
// 100,000, with every slot since HEAD - 7400 stored but HEAD - 2, which was
// missed. Each test changes only the rows it is about and reads the snapshot.
describe(buildLiveBlobs.name, () => {
  const HEAD = 100_000
  const MISSED = HEAD - 2
  const NOW = slotStart(HEAD) + 5

  it('serves the belt newest first, its batches in block order, a missed slot where a block is skipped', () => {
    const blobs = buildLiveBlobs(
      rows({
        batches: [
          batch(HEAD - 1, 0, 'base', 2),
          batch(HEAD - 1, 1, undefined, 1),
          batch(HEAD, 0, 'arbitrum', 3),
        ],
      }),
      HEAD,
      NOW,
    )

    expect(blobs.head).toEqual(HEAD)
    expect(blobs.blocks.map((b) => b.slot)).toEqual(
      Array.from({ length: BELT_SLOTS }, (_, i) => HEAD - i),
    )
    expect(blobs.blocks.slice(0, 3)).toEqual([
      {
        slot: HEAD,
        status: 'proposed',
        blockNumber: HEAD + 1000,
        batches: [
          { projectId: 'arbitrum', blobs: 3, to: '0xto', txHash: '0x0' },
        ],
      },
      {
        slot: HEAD - 1,
        status: 'proposed',
        blockNumber: HEAD + 999,
        batches: [
          { projectId: 'base', blobs: 2, to: '0xto', txHash: '0x0' },
          { projectId: undefined, blobs: 1, to: '0xto', txHash: '0x1' },
        ],
      },
      { slot: MISSED, status: 'missed' },
    ])
  })

  it('reaches back only as far as the oldest stored slot', () => {
    const range = { from: HEAD - 9, to: HEAD, blocks: 9 }
    const blobs = buildLiveBlobs(
      rows({ stored: range, inWindow: range }),
      HEAD,
      NOW,
    )

    expect(blobs.blocks.length).toEqual(10)
    expect(blobs.window.slots).toEqual(10)
    expect(blobs.window.blocks).toEqual(9)
  })

  it('caps the window at a day', () => {
    const blobs = buildLiveBlobs(rows(), HEAD, NOW)

    expect(blobs.window.slots).toEqual(WINDOW_SLOTS)
  })

  it('counts a window whose first slot was missed as whole', () => {
    const windowStart = HEAD - WINDOW_SLOTS + 1
    const blobs = buildLiveBlobs(
      rows({ inWindow: { from: windowStart + 1, to: HEAD, blocks: 7198 } }),
      HEAD,
      NOW,
    )

    expect(blobs.window.slots).toEqual(WINDOW_SLOTS)
    expect(blobs.window.blocks).toEqual(7198)
  })

  it("counts the head's blobs from its block", () => {
    const blobs = buildLiveBlobs(
      rows({ blocks: [{ ...block(HEAD), blobCount: 5 }] }),
      HEAD,
      NOW,
    )

    expect(blobs.window.newestBlobs).toEqual(5)
  })

  it('lays the pulse out in steps fixed from genesis, the last under way', () => {
    // the head's step is 4000 and the 287 before it start at 3713. The
    // window's oldest slots fall in the middle of 3712, which is left out
    const current = Math.floor(HEAD / PULSE_BUCKET_SLOTS)
    const first = current - PULSE_BUCKETS + 1

    const blobs = buildLiveBlobs(
      rows({
        pulse: [
          { bucket: first - 1, blocks: 20, blobs: 99 },
          { bucket: first, blocks: 24, blobs: 120 },
          { bucket: current, blocks: 1, blobs: 6 },
        ],
      }),
      HEAD,
      NOW,
    )

    expect(blobs.window.pulse.firstBucket).toEqual(first)
    const steps = blobs.window.pulse.buckets
    expect(steps.length).toEqual(PULSE_BUCKETS)
    expect(steps[0]).toEqual({ blocks: 24, blobs: 120 })
    expect(steps[1]).toEqual({ blocks: 0, blobs: 0 })
    expect(steps.at(-1)).toEqual({ blocks: 1, blobs: 6 })
  })

  it('sums up each poster with its buckets, most blobs first', () => {
    // the head's bucket is 666 and the 47 before it start at 619. The
    // window's oldest slots fall in the middle of 618, which is left out
    const current = Math.floor(HEAD / BUCKET_SLOTS)
    const first = current - BUCKETS + 1

    const blobs = buildLiveBlobs(
      rows({
        posted: [
          posted(undefined, 4),
          posted('base', 10),
          posted('arbitrum', 10, HEAD - 5),
        ],
        buckets: [
          { projectId: ProjectId('base'), bucket: first - 1, blobs: 1 },
          { projectId: ProjectId('base'), bucket: first, blobs: 3 },
          { projectId: ProjectId('base'), bucket: current, blobs: 6 },
          { projectId: undefined, bucket: current, blobs: 4 },
          { projectId: ProjectId('arbitrum'), bucket: current, blobs: 10 },
        ],
      }),
      HEAD,
      NOW,
    )

    expect(blobs.window.firstBucket).toEqual(first)
    expect(blobs.window.posted).toEqual([
      // a tie goes to the one that posted last
      {
        ...posted('base', 10),
        buckets: withBuckets({ 0: 3, [BUCKETS - 1]: 6 }),
      },
      {
        ...posted('arbitrum', 10, HEAD - 5),
        buckets: withBuckets({ [BUCKETS - 1]: 10 }),
      },
      { ...posted(undefined, 4), buckets: withBuckets({ [BUCKETS - 1]: 4 }) },
    ])
  })

  it('is live while the head is at most 3 slots behind the clock', () => {
    const at = (slot: number) => slotStart(slot) + 11

    expect(buildLiveBlobs(rows(), HEAD, at(HEAD + 3)).live).toEqual(true)
    expect(buildLiveBlobs(rows(), HEAD, at(HEAD + 4)).live).toEqual(false)
  })

  describe(buildPastBlobs.name, () => {
    const stored = { from: HEAD - 7400, to: HEAD, blocks: 7399 }

    it('serves the page newest first, its batches in block order, a missed slot where a block is skipped', () => {
      const GAP = HEAD - 20
      const blocks: LiveBlockRecord[] = []
      for (let slot = HEAD - 40; slot <= HEAD - 9; slot++) {
        if (slot !== GAP) blocks.push(block(slot))
      }

      const past = buildPastBlobs(
        {
          stored,
          blocks,
          batches: [batch(GAP + 1, 0, 'base', 2), batch(GAP + 1, 1, 'op', 1)],
        },
        HEAD,
        HEAD - 40,
        HEAD - 9,
      )

      expect(past.blocks.map((b) => b.slot)).toEqual(
        Array.from({ length: 32 }, (_, i) => HEAD - 9 - i),
      )
      expect(past.blocks.slice(10, 12)).toEqual([
        {
          slot: GAP + 1,
          status: 'proposed',
          blockNumber: GAP + 1001,
          batches: [
            { projectId: 'base', blobs: 2, to: '0xto', txHash: '0x0' },
            { projectId: 'op', blobs: 1, to: '0xto', txHash: '0x1' },
          ],
        },
        { slot: GAP, status: 'missed' },
      ])
      expect(past.complete).toEqual(true)
    })

    it('serves no slots past the head, nor out of the day or the database', () => {
      const atHead = buildPastBlobs(
        { stored, blocks: [block(HEAD)], batches: [] },
        HEAD,
        HEAD - 1,
        HEAD + 30,
      )
      expect(atHead.blocks.map((b) => b.slot)).toEqual([HEAD, HEAD - 1])

      const outOfDay = HEAD - WINDOW_SLOTS
      expect(
        buildPastBlobs(
          { stored, blocks: [], batches: [] },
          HEAD,
          outOfDay - 31,
          outOfDay,
        ),
      ).toEqual({ blocks: [], complete: true })

      const shortStore = { from: HEAD - 10, to: HEAD, blocks: 11 }
      const short = buildPastBlobs(
        { stored: shortStore, blocks: [], batches: [] },
        HEAD,
        HEAD - 40,
        HEAD - 9,
      )
      expect(short.blocks.map((b) => b.slot)).toEqual([HEAD - 9, HEAD - 10])
    })

    it('keeps a page open while the backend may still rewrite its last slots', () => {
      const endingAt = (last: number) =>
        buildPastBlobs(
          { stored, blocks: [], batches: [] },
          HEAD,
          last - 31,
          last,
        ).complete

      expect(endingAt(HEAD - 2)).toEqual(false)
      expect(endingAt(HEAD - 3)).toEqual(true)
    })
  })

  function rows(overrides: Partial<LiveBlobsRows> = {}): LiveBlobsRows {
    const blocks: LiveBlockRecord[] = []
    for (let slot = HEAD - BELT_SLOTS + 1; slot <= HEAD; slot++) {
      if (slot !== MISSED) blocks.push(block(slot))
    }
    return {
      stored: { from: HEAD - 7400, to: HEAD, blocks: 7399 },
      inWindow: { from: HEAD - WINDOW_SLOTS + 1, to: HEAD, blocks: 7199 },
      blocks,
      batches: [],
      posted: [],
      buckets: [],
      pulse: [],
      ...overrides,
    }
  }

  function block(slot: number): LiveBlockRecord {
    return {
      slot,
      blockNumber: slot + 1000,
      hash: `0x${slot}`,
      timestamp: UnixTime(slotStart(slot)),
      blobCount: (HEAD - slot) % 4,
    }
  }

  function batch(
    slot: number,
    txIndex: number,
    projectId: string | undefined,
    blobs: number,
  ): LiveBlobBatchRecord {
    return {
      slot,
      txIndex,
      txHash: `0x${txIndex}`,
      blockNumber: slot + 1000,
      from: '0xfrom',
      to: '0xto',
      blobs,
      topics: [],
      projectId: projectId === undefined ? undefined : ProjectId(projectId),
    }
  }

  function posted(
    projectId: string | undefined,
    blobs: number,
    lastSlot = HEAD,
  ) {
    return {
      projectId: projectId === undefined ? undefined : ProjectId(projectId),
      blobs,
      batches: blobs / 2,
      lastSlot,
      lastBlobs: 2,
    }
  }

  function withBuckets(blobs: Record<number, number>) {
    return Array.from({ length: BUCKETS }, (_, i) => blobs[i] ?? 0)
  }
})
