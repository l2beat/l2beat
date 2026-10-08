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
  WINDOW_SLOTS,
} from './LiveBlobsFeed'
import { PAST_PAGE_SLOTS, RECENT_SLOTS } from './slots'

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

  it('serves a page of the hour from what it holds, newest first', async () => {
    const node = fakeNode()
    feed = new LiveBlobsFeed(node.source, Logger.SILENT)
    await feed.latest()
    await feed.backfilled()
    const asked = node.blocksAsked

    // slots 960-991, all behind the head
    const page = feed.past({ page: 30 })

    expect(page.blocks.map((b) => b.slot)).toEqual(
      Array.from({ length: PAST_PAGE_SLOTS }, (_, i) => 991 - i),
    )
    expect(page.complete).toEqual(true)
    expect(node.blocksAsked).toEqual(asked)
  })

  it('tells a page still to be filled from one that is done', async () => {
    const GAP = 970
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

    // a block of slots 960-991 failed to come, and 992-1023 runs past the head
    expect(feed.past({ page: 30 }).complete).toEqual(false)
    expect(feed.past({ page: 31 }).complete).toEqual(false)
    // slots 640-671 left the hour, so there is nothing more to come for them
    expect(feed.past({ page: 20 })).toEqual({ blocks: [], complete: true })
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
        batches: [{ projectId: 'base', blobs: 2, to: '0x', txHash: '0x' }],
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

  it('lets go of the block above a head that moved back, and tells a page that has it at once', async () => {
    const clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
    try {
      const node = fakeNode()
      feed = new LiveBlobsFeed(node.source, Logger.SILENT)
      await feed.latest()

      // the chain drops its newest block for none, for now
      node.head = HEAD - 1
      node.reorgs = 1
      await clock.tickAsync(8000)
      const asked = feed.latestAfter({ after: HEAD })
      await clock.tickAsync(0)
      const back = await asked
      expect(back?.head).toEqual(HEAD - 1)
      expect(back?.blocks[0]?.slot).toEqual(HEAD - 1)

      // another block fills the slot: it is fetched, not the dropped one served
      node.head = HEAD
      await clock.tickAsync(12_000)
      const filled = await feed.latest()
      expect(filled?.blocks[0]).toEqual({
        slot: HEAD,
        status: 'proposed',
        blockNumber: HEAD + 1001,
        batches: [{ projectId: 'base', blobs: 2, to: '0x', txHash: '0x' }],
      })
    } finally {
      clock.uninstall()
    }
  })

  it('looks again at a block behind a moved head whose fresh look failed, before the head moves on', async () => {
    // five seconds into the head's slot, so the next poll is due in eight
    const clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
    try {
      const node = fakeNode()
      feed = new LiveBlobsFeed(node.source, Logger.SILENT)
      await feed.latest()

      // the chain drops the head's block as the next comes, but the fresh
      // look at it fails; the head then stays put
      node.dropped = HEAD
      node.failing = HEAD
      node.head = HEAD + 1
      await clock.tickAsync(8000)
      node.failing = undefined
      await clock.tickAsync(12_000)
      const blobs = await feed.latest()

      expect(blobs?.blocks.find((b) => b.slot === HEAD)?.status).toEqual(
        'missed',
      )
    } finally {
      clock.uninstall()
    }
  })

  it('answers a waiting page when a block that failed to come is fetched after all', async () => {
    const clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
    try {
      const node = fakeNode()
      feed = new LiveBlobsFeed(node.source, Logger.SILENT)
      await feed.latest()

      // the head moves on, but its block cannot be fetched yet
      node.failing = HEAD + 1
      node.head = HEAD + 1
      await clock.tickAsync(8000)
      const without = await feed.latest()
      expect(without?.head).toEqual(HEAD + 1)
      expect(without?.live).toEqual(false)
      expect(without?.blocks[0]?.slot).toEqual(HEAD)

      let answer: LiveBlobs | undefined
      void feed.latestAfter({ after: HEAD + 1 }).then((blobs) => {
        answer = blobs
      })
      node.failing = undefined
      // the retry after one failure is due in two seconds
      await clock.tickAsync(2000)

      expect(answer?.live).toEqual(true)
      expect(answer?.blocks[0]?.slot).toEqual(HEAD + 1)
    } finally {
      clock.uninstall()
    }
  })

  it('gives up on a block that keeps failing, rather than back off from the node for as long as it is recent', async () => {
    const clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
    try {
      const node = fakeNode()
      node.failing = HEAD - 5
      feed = new LiveBlobsFeed(node.source, Logger.SILENT)
      await feed.latest()

      // three tries with the backoff between them, 2 s and 4 s, then the poll
      // 8 s on that finds nothing left to ask for
      await clock.tickAsync(15_000)
      const givenUp = await feed.latest()
      expect(givenUp?.live).toEqual(true)
      expect(givenUp?.blocks.map((b) => b.slot) ?? []).not.toInclude(HEAD - 5)
      expect(node.failed).toEqual(3)

      // the head moves on a minute later: the slot is not asked for again
      node.head = HEAD + 5
      await clock.tickAsync(60_000)
      const later = await feed.latest()
      expect(later?.head).toEqual(HEAD + 5)
      expect(later?.live).toEqual(true)
      expect(node.failed).toEqual(3)
    } finally {
      clock.uninstall()
    }
  })

  it('counts the wait for the first answer into how long a page is held', async () => {
    const clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
    try {
      const node = fakeNode()
      feed = new LiveBlobsFeed(node.source, Logger.SILENT)
      await feed.latest()
      // the feed starts anew, as after a quiet spell, and the node hangs
      feed.stop()
      node.source.headSlot = () => new Promise(() => {})

      let answer: LiveBlobs | undefined
      void feed.latestAfter({ after: HEAD }).then((blobs) => {
        answer = blobs
      })
      await clock.tickAsync(19_000)
      expect(answer).toEqual(undefined)

      await clock.tickAsync(1500)
      expect(answer?.head).toEqual(HEAD)
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
      /** A slot whose block the node fails to answer for */
      failing: undefined as number | undefined,
      /** Asks the node failed to answer */
      failed: 0,
      /** How often the chain was rebuilt: a block fetched again after one is another */
      reorgs: 0,
      blocksAsked: 0,
      source: {} as BeaconSource,
    }
    node.source = {
      headSlot: async () => node.head,
      block: async (slot): Promise<LiveBlock> => {
        node.blocksAsked++
        if (slot === node.failing) {
          node.failed++
          throw new Error()
        }
        if (slot === MISSED || slot === node.dropped) {
          return { slot, status: 'missed' }
        }
        return {
          slot,
          status: 'proposed',
          blockNumber: slot + 1000 + node.reorgs,
          batches:
            slot % 10 === 0
              ? [{ projectId: 'base', blobs: 2, to: '0x', txHash: '0x' }]
              : [],
        }
      },
    }
    return node
  }
})
