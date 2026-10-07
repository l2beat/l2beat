import { Logger } from '@l2beat/backend-tools'
import type { LiveBlockRecord } from '@l2beat/database'
import { slotStart, UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import {
  type LiveBlobs,
  LiveBlobsFeed,
  type LiveBlobsSource,
  PastBlobsParams,
} from './LiveBlobsFeed'

// Methodology: a fake database whose head is slot 1000, with every slot
// before it stored. The clock is faked five seconds into the head's slot, so
// the head is live, and moved on by hand. The feed is asked the way the route
// asks it, and the fake counts the reads the feed makes.
describe(LiveBlobsFeed.name, () => {
  const HEAD = 1000
  let clock: InstalledClock
  let feed: LiveBlobsFeed | undefined

  beforeEach(() => {
    clock = install({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
      now: (slotStart(HEAD) + 5) * 1000,
    })
  })

  afterEach(() => {
    feed?.stop()
    clock.uninstall()
  })

  it('answers with the rows of the head, read once however many ask at once', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)

    const answers = await Promise.all([
      feed.latest(),
      feed.latest(),
      feed.latest(),
    ])

    expect(answers.map((a) => a?.head)).toEqual([HEAD, HEAD, HEAD])
    expect(answers[0]?.live).toEqual(true)
    expect(answers[0]?.blocks[0]?.slot).toEqual(HEAD)
    expect(db.loads).toEqual(1)
  })

  it('reads the head every 250 ms, and the rows only when it moved', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()

    await clock.tickAsync(1000)
    expect(db.headReads).toEqual(5)
    expect(db.loads).toEqual(1)

    db.head = HEAD + 1
    await clock.tickAsync(250)
    expect(db.loads).toEqual(2)
  })

  it('holds a page that is up to date until the head moves', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()

    const answer = answerOf(feed.latestAfter({ after: HEAD }))
    await clock.tickAsync(5000)
    expect(answer.value).toEqual(undefined)

    db.head = HEAD + 1
    await clock.tickAsync(250)
    expect(answer.value?.head).toEqual(HEAD + 1)
  })

  it('answers a page that is behind at once', async () => {
    feed = new LiveBlobsFeed(fakeDb().source, Logger.SILENT)

    const blobs = await feed.latestAfter({ after: HEAD - 3 })

    expect(blobs?.head).toEqual(HEAD)
  })

  it('reads the rows again when the head block is replaced in its slot', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()

    db.reorgs = 1
    await clock.tickAsync(250)

    expect(db.loads).toEqual(2)
  })

  it('answers a waiting page with a head moved back', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()

    const answer = answerOf(feed.latestAfter({ after: HEAD }))
    db.head = HEAD - 1
    await clock.tickAsync(250)

    expect(answer.value?.head).toEqual(HEAD - 1)
  })

  it('serves the last snapshot with live false on a database error, and tells waiting pages', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()

    const answer = answerOf(feed.latestAfter({ after: HEAD }))
    db.failing = true
    await clock.tickAsync(250)

    expect(answer.value?.head).toEqual(HEAD)
    expect(answer.value?.live).toEqual(false)
    expect(answer.value?.blocks[0]?.slot).toEqual(HEAD)
  })

  it('is live again once the database answers', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()
    db.failing = true
    await clock.tickAsync(250)

    const answer = answerOf(feed.latestAfter({ after: HEAD }))
    db.failing = false
    // backed off: half a second after one failure
    await clock.tickAsync(500)

    expect(answer.value?.live).toEqual(true)
  })

  it('tells a waiting page once the head falls behind the clock', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()

    // nine seconds into slot HEAD + 3, with no block since the head
    await clock.tickAsync(40_000)
    const answer = answerOf(feed.latestAfter({ after: HEAD }))
    await clock.tickAsync(1000)
    expect(answer.value).toEqual(undefined)

    // into slot HEAD + 4
    await clock.tickAsync(2250)
    expect(answer.value?.head).toEqual(HEAD)
    expect(answer.value?.live).toEqual(false)
  })

  it('stops reading once nobody asked for a minute, and starts on the next ask', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()

    await clock.tickAsync(61_000)
    const reads = db.headReads
    await clock.tickAsync(10_000)
    expect(db.headReads).toEqual(reads)

    db.head = HEAD + 6
    const blobs = await feed.latest()
    expect(blobs?.head).toEqual(HEAD + 6)
  })

  it('counts the wait for the first answer into how long a page is held', async () => {
    const db = fakeDb()
    feed = new LiveBlobsFeed(db.source, Logger.SILENT)
    await feed.latest()
    // the feed starts anew, as after a quiet spell, and the database hangs
    feed.stop()
    db.source.liveBlock.findHead = () => new Promise(() => {})

    const answer = answerOf(feed.latestAfter({ after: HEAD }))
    await clock.tickAsync(19_000)
    expect(answer.value).toEqual(undefined)

    await clock.tickAsync(1500)
    expect(answer.value?.head).toEqual(HEAD)
  })

  it('has no answer while the database has no blocks, or has never been read', async () => {
    const empty = fakeDb()
    empty.head = undefined
    feed = new LiveBlobsFeed(empty.source, Logger.SILENT)
    expect(await feed.latest()).toEqual(undefined)
    feed.stop()

    const down = fakeDb()
    down.failing = true
    feed = new LiveBlobsFeed(down.source, Logger.SILENT)
    expect(await feed.latest()).toEqual(undefined)
  })

  it('reads a page of the hour from the database, behind the head', async () => {
    feed = new LiveBlobsFeed(fakeDb().source, Logger.SILENT)

    // slots 960-991
    const page = await feed.past({ page: 30 })

    expect(page.blocks.map((b) => b.slot)).toEqual(
      Array.from({ length: 32 }, (_, i) => 991 - i),
    )
    expect(page.complete).toEqual(true)
  })

  it('takes only whole pages counted from genesis', () => {
    expect(PastBlobsParams.safeValidate({ page: 30 }).success).toEqual(true)
    // past the safe integers, a slot minus one is the same slot
    for (const page of [1e20, -1, 1.5, Number.NaN]) {
      expect(PastBlobsParams.safeValidate({ page }).success).toEqual(false)
    }
  })

  /** Lets a promise be looked at while it is still pending */
  function answerOf(promise: Promise<LiveBlobs | undefined>) {
    const answer: { value: LiveBlobs | undefined } = { value: undefined }
    void promise.then((value) => {
      answer.value = value
    })
    return answer
  }

  function fakeDb() {
    const db = {
      head: HEAD as number | undefined,
      /** Times the chain swapped blocks at the head: a block at the same slot with another hash */
      reorgs: 0,
      failing: false,
      headReads: 0,
      /** Times the rows were read, counted by the posters */
      loads: 0,
      source: {} as LiveBlobsSource,
    }
    const fail = () => {
      if (db.failing) throw new Error('Database down')
    }
    const block = (slot: number): LiveBlockRecord => ({
      slot,
      blockNumber: slot + 1000,
      hash: `0x${slot}-${db.reorgs}`,
      timestamp: UnixTime(slotStart(slot)),
      blobCount: 1,
    })
    db.source = {
      liveBlock: {
        findHead: async () => {
          db.headReads++
          fail()
          return db.head === undefined ? undefined : block(db.head)
        },
        getSlotRange: async (fromSlot = 0) => {
          fail()
          return db.head === undefined
            ? undefined
            : { from: fromSlot, to: db.head, blocks: db.head - fromSlot + 1 }
        },
        getBySlotRange: async (from, to) => {
          fail()
          return Array.from({ length: to - from + 1 }, (_, i) =>
            block(from + i),
          )
        },
      },
      liveBlobBatch: {
        getBySlotRange: async () => {
          fail()
          return []
        },
        getPostedSince: async () => {
          db.loads++
          fail()
          return []
        },
        getBucketsSince: async () => {
          fail()
          return []
        },
      },
    }
    return db
  }
})
