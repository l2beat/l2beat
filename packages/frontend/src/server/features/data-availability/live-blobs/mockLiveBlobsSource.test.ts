import { Logger } from '@l2beat/backend-tools'
import { slotStart } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { LiveBlobsFeed } from './LiveBlobsFeed'
import { BUCKETS, WINDOW_SLOTS } from './liveBlobsSlots'
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
    expect(blobs?.window.blobsPerSlot[0]).toEqual(newestBlobs)
  })
})
