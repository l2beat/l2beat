import { install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { slotStart } from '~/utils/beaconSlots'
import type { MempoolSource } from './mempool'
import {
  createMockMempool,
  createPosterPicker,
  mockBroadcasts,
} from './mockBeaconNode'
import type { PendingTx } from './pendingBlobs'

// Methodology: the mock mempool is run on a fake clock from just before a
// slot to the moment its block is seen, and what it broadcast is compared
// with what the slot's block holds.
describe(createMockMempool.name, () => {
  const POSTERS = ['base', 'arbitrum', 'optimism']
  const pick = createPosterPicker(POSTERS)

  it('broadcasts every batch of a slot, however its ticks fall around the slot start', async () => {
    // a slot with a batch due in the last 150 ms before it starts, which a
    // tick 150 ms before and the next 100 ms after would both pass over
    const slot = findSlot(
      (s) =>
        mockBroadcasts(s, pick).some(
          ({ broadcastAt }) => slotStart(s) - broadcastAt < 0.15,
        ),
      1000,
    )
    const clock = install({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
      ],
      now: (slotStart(slot) - 0.9) * 1000,
    })
    try {
      const heard = await broadcastsHeard(
        createMockMempool(Promise.resolve(POSTERS)),
        2900,
        clock,
      )

      const due = mockBroadcasts(slot, pick).map(({ tx }) => tx.hash)
      expect(due.length).toBeGreaterThan(0)
      expect(heard.filter((hash) => due.includes(hash)).sort()).toEqual(
        due.sort(),
      )
    } finally {
      clock.uninstall()
    }
  })

  it('goes on when the posters could not be loaded, rather than crash the server', async () => {
    // Node ends the process on a rejection nobody handles; this test stands
    // in as that nobody and counts them instead
    const unhandled: unknown[] = []
    const count = (reason: unknown) => unhandled.push(reason)
    process.on('unhandledRejection', count)
    const clock = install({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
      ],
    })
    try {
      const posters = Promise.reject<string[]>(new Error('no posters'))
      // the block feed is the one to await and report it
      posters.catch(() => {})

      await broadcastsHeard(createMockMempool(posters), 600, clock)

      expect(unhandled).toEqual([])
    } finally {
      clock.uninstall()
      process.off('unhandledRejection', count)
    }
  })

  async function broadcastsHeard(
    mempool: MempoolSource,
    forMs: number,
    clock: { tickAsync: (ms: number) => Promise<unknown> },
  ) {
    const heard: string[] = []
    mempool.watch((tx: PendingTx) => heard.push(tx.hash))
    await clock.tickAsync(forMs)
    await new Promise((resolve) => setImmediate(resolve))
    mempool.stop()
    return heard
  }

  function findSlot(fits: (slot: number) => boolean, from: number) {
    for (let slot = from; slot < from + 10_000; slot++) {
      if (fits(slot)) return slot
    }
    throw new Error('no such slot')
  }
})
