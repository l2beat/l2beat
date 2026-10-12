import { Logger } from '@l2beat/backend-tools'
import { slotStart } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { LiveBlobsFeed } from './LiveBlobsFeed'
import { BUCKETS, PULSE_BUCKETS, WINDOW_SLOTS } from './liveBlobsSlots'
import { createMockLiveBlobsSource } from './mockLiveBlobsSource'

// Methodology: the feed reads the mock as it would the database, at a fixed
// moment, with no database anywhere. The snapshot must hold together the way
// one read from real rows does: sums that agree with each other.
describe(createMockLiveBlobsSource.name, () => {
  const HEAD = 10_000_000

  it('serves a whole day the feed can build a snapshot from', async () => {
    const now = () => slotStart(HEAD) + 5
    const source = createMockLiveBlobsSource(
      Promise.resolve(['base', 'arbitrum', 'optimism']),
      now,
    )
    const feed = new LiveBlobsFeed(source, Logger.SILENT, now)

    const blobs = await feed.latest()
    feed.stop()

    expect(blobs?.live).toEqual(true)
    expect(blobs?.blocks[0]?.status).toEqual('proposed')
    expect(blobs?.window.slots).toEqual(WINDOW_SLOTS)
    const posted = blobs?.window.posted ?? []
    expect(posted.map((p) => p.projectId)).toInclude('base', undefined)
    // the bucket cut by the window's edge is left out, so the bars hold at
    // most the posters' totals
    for (const p of posted) {
      expect(p.buckets.length).toEqual(BUCKETS)
      expect(p.buckets.reduce((sum, b) => sum + b, 0)).toBeLessThanOrEqual(
        p.blobs,
      )
    }
    const newest = blobs?.blocks[0]
    const newestBlobs =
      newest?.status === 'proposed'
        ? newest.batches.reduce((sum, b) => sum + b.blobs, 0)
        : undefined
    expect(blobs?.window.newestBlobs).toEqual(newestBlobs)
    // the pulse's oldest step is cut by the window's edge too
    const pulse = blobs?.window.pulse.buckets ?? []
    expect(pulse.length).toEqual(PULSE_BUCKETS)
    expect(pulse.reduce((sum, b) => sum + b.blocks, 0)).toBeLessThanOrEqual(
      blobs?.window.blocks ?? 0,
    )
    expect(pulse.reduce((sum, b) => sum + b.blobs, 0)).toBeLessThanOrEqual(
      posted.reduce((sum, p) => sum + p.blobs, 0),
    )
  })

  it('has the next blocks wait in the mempool, and land saying since when', async () => {
    let time = slotStart(HEAD) + 5
    const now = () => time
    const source = createMockLiveBlobsSource(Promise.resolve(['base']), now)
    const feed = new LiveBlobsFeed(source, Logger.SILENT, now)

    const before = await feed.latest()
    feed.stop()
    time = slotStart(HEAD + 1) + 5
    const after = await feed.latest()
    feed.stop()

    const pending = before?.pending ?? []
    expect(pending.length).toBeGreaterThan(0)
    const landed = after?.blocks[0]
    const waited =
      landed?.status === 'proposed' ? landed.batches.map((b) => b.waited) : []
    // and some heard of in between
    expect(waited).toInclude(
      ...pending.map((p) => ({ key: p.key, since: p.firstSeenAt })),
    )
  })
})
