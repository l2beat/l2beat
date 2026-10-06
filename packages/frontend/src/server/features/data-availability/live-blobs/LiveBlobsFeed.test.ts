import { Logger } from '@l2beat/backend-tools'
import { install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { slotStart } from '~/utils/beaconSlots'
import {
  type BeaconSource,
  BUCKET_SLOTS,
  type LiveBlobs,
  LiveBlobsFeed,
  type LiveBlock,
  RECENT_SLOTS,
  WINDOW_SLOTS,
} from './LiveBlobsFeed'

// Methodology: a fake node whose head is slot 1000, where slot 998 was missed
// and Base posts 2 blobs every 10th slot. The feed is asked the way the route
// asks it, and the fake counts what the node would have been asked for.
describe(LiveBlobsFeed.name, () => {
  const HEAD = 1000
  const MISSED = 998
  let feed: LiveBlobsFeed | undefined

  afterEach(() => feed?.stop())

  it('answers with the belt blocks, newest first, before the backfill', async () => {
    feed = new LiveBlobsFeed(fakeNode().source, Logger.SILENT)

    const blobs = await feed.latest()

    expect(blobs?.head).toEqual(HEAD)
    expect(blobs?.live).toEqual(true)
    expect(blobs?.blocks.map((b) => b.slot)).toEqual(
      Array.from({ length: RECENT_SLOTS }, (_, i) => HEAD - i),
    )
    expect(blobs?.blocks.find((b) => b.slot === MISSED)?.status).toEqual(
      'missed',
    )
  })

  it('fetches each block of the hour once, however many ask at once', async () => {
    const node = fakeNode()
    feed = new LiveBlobsFeed(node.source, Logger.SILENT)

    await Promise.all([feed.latest(), feed.latest(), feed.latest()])
    await feed.backfilled()

    expect(node.blocksAsked).toEqual(WINDOW_SLOTS)
  })

  it('sums up who posted over the hour once it is backfilled', async () => {
    feed = new LiveBlobsFeed(fakeNode().source, Logger.SILENT)

    await feed.latest()
    await feed.backfilled()
    const blobs = await feed.latest()

    const hour = blobs?.window
    expect(hour?.slots).toEqual(WINDOW_SLOTS)
    expect(hour?.blocks).toEqual(WINDOW_SLOTS - 1)
    expect(hour?.blobsPerSlot.slice(0, 3)).toEqual([2, 0, null])
    // Steps are 25 slots from genesis: the head's step is 40 (slots
    // 1000-1024) and the eleven before it start at 29. Base posts 2 blobs
    // every 10th slot, so a full step holds 3 batches or 2, by turns, and the
    // step under way holds only the head's batch
    expect(hour?.firstBucket).toEqual(29)
    expect(hour?.posted).toEqual([
      {
        projectId: 'base',
        blobs: 60,
        batches: 30,
        lastSlot: HEAD,
        lastBlobs: 2,
        buckets: [
          ...Array.from({ length: WINDOW_SLOTS / BUCKET_SLOTS - 1 }, (_, i) =>
            i % 2 === 1 ? 6 : 4,
          ),
          2,
        ],
      },
    ])
  })

  it('sums up only as far back as it knows every block', async () => {
    const GAP = HEAD - 100
    const node = fakeNode()
    feed = new LiveBlobsFeed(
      {
        ...node.source,
        block: (slot) =>
          slot === GAP ? Promise.reject(new Error()) : node.source.block(slot),
      },
      Logger.SILENT,
    )

    await feed.latest()
    await feed.backfilled()
    const blobs = await feed.latest()

    expect(blobs?.window.slots).toEqual(HEAD - GAP)
  })

  it('holds a page that is up to date until the next block comes', async () => {
    // five seconds into the head's slot, so the next poll is due in eight
    const clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
    try {
      const node = fakeNode()
      feed = new LiveBlobsFeed(node.source, Logger.SILENT)
      await feed.latest()

      let answer: LiveBlobs | undefined
      void feed.latestAfter({ after: HEAD }).then((blobs) => {
        answer = blobs
      })
      await clock.tickAsync(1000)
      expect(answer).toEqual(undefined)

      node.head = HEAD + 1
      await clock.tickAsync(8000)
      expect(answer?.head).toEqual(HEAD + 1)
    } finally {
      clock.uninstall()
    }
  })

  it('lets go of a block the chain dropped once the head moves on', async () => {
    // five seconds into the head's slot, so the next poll is due in eight
    const clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
    try {
      const node = fakeNode()
      feed = new LiveBlobsFeed(node.source, Logger.SILENT)
      const before = await feed.latest()
      expect(before?.blocks[0]).toEqual({
        slot: HEAD,
        status: 'proposed',
        blockNumber: HEAD + 1000,
        batches: [{ projectId: 'base', blobs: 2, to: '0x' }],
      })

      // the next block is built on the one before the head
      node.dropped = HEAD
      node.head = HEAD + 1
      await clock.tickAsync(8000)
      const after = await feed.latest()

      expect(after?.blocks.slice(0, 2)).toEqual([
        {
          slot: HEAD + 1,
          status: 'proposed',
          blockNumber: HEAD + 1001,
          batches: [],
        },
        { slot: HEAD, status: 'missed' },
      ])
      expect(after?.window.posted[0]?.lastSlot).toEqual(HEAD - 10)
    } finally {
      clock.uninstall()
    }
  })

  it('answers a page that is behind at once', async () => {
    feed = new LiveBlobsFeed(fakeNode().source, Logger.SILENT)

    const blobs = await feed.latestAfter({ after: HEAD - 3 })

    expect(blobs?.head).toEqual(HEAD)
  })

  it('has no answer while the node has never been reached', async () => {
    feed = new LiveBlobsFeed(
      { ...fakeNode().source, headSlot: () => Promise.reject(new Error()) },
      Logger.SILENT,
    )

    expect(await feed.latest()).toEqual(undefined)
  })

  function fakeNode() {
    const node = {
      head: HEAD,
      /** A slot whose block the chain dropped after it was first served */
      dropped: undefined as number | undefined,
      blocksAsked: 0,
      source: {} as BeaconSource,
    }
    node.source = {
      headSlot: async () => node.head,
      block: async (slot): Promise<LiveBlock> => {
        node.blocksAsked++
        if (slot === MISSED || slot === node.dropped) {
          return { slot, status: 'missed' }
        }
        return {
          slot,
          status: 'proposed',
          blockNumber: slot + 1000,
          batches:
            slot % 10 === 0 ? [{ projectId: 'base', blobs: 2, to: '0x' }] : [],
        }
      },
    }
    return node
  }
})
