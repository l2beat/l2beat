import { expect } from 'earl'
import {
  MAX_PENDING,
  PENDING_LIFETIME,
  PendingBlobs,
  type PendingTx,
} from './pendingBlobs'

// Methodology: transactions are fed in the order a mempool and a chain
// would tell of them, at made-up times in seconds, and what is pending is
// read back. Base's batcher stands in for any sender.
describe(PendingBlobs.name, () => {
  const BASE = '0xbase'

  it('keeps a fee-bump resend as the same batch, waiting since the first', () => {
    const pending = new PendingBlobs()

    pending.seen(tx({ nonce: 7, hash: '0xa' }), 100)
    pending.seen(tx({ nonce: 7, hash: '0xb' }), 130)

    expect(pending.list()).toEqual([
      { ...tx({ nonce: 7, hash: '0xb' }), firstSeenAt: 100 },
    ])
  })

  it('lets a batch go when its block comes, saying since when it waited', () => {
    const pending = new PendingBlobs()
    pending.seen(tx({ nonce: 7 }), 100)
    pending.seen(tx({ nonce: 8 }), 101)

    const waitedSince = pending.included(BASE, 7, 112)

    expect(waitedSince).toEqual(100)
    expect(pending.list().map((b) => b.nonce)).toEqual([8])
  })

  it('lets go of the resend when the original is included', () => {
    // the block took the first version, so the bumped one can never be
    const pending = new PendingBlobs()
    pending.seen(tx({ nonce: 7, hash: '0xa' }), 100)
    pending.seen(tx({ nonce: 7, hash: '0xb' }), 110)

    expect(pending.included(BASE, 7, 112)).toEqual(100)
    expect(pending.list()).toEqual([])
  })

  it('lets go of lower nonces, which can no longer be included', () => {
    const pending = new PendingBlobs()
    pending.seen(tx({ nonce: 7 }), 100)
    pending.seen(tx({ nonce: 8 }), 101)
    pending.seen(tx({ from: '0xother', nonce: 3 }), 102)

    expect(pending.included(BASE, 9, 112)).toEqual(undefined)
    expect(pending.list().map((b) => b.from)).toEqual(['0xother'])
  })

  it('does not wait for a block that came before the transaction did', () => {
    const pending = new PendingBlobs()
    pending.included(BASE, 7, 112)

    pending.seen(tx({ nonce: 7 }), 113)
    pending.seen(tx({ nonce: 6 }), 113)

    expect(pending.list()).toEqual([])
  })

  it('expires a batch not heard of for its lifetime, unless resent', () => {
    const pending = new PendingBlobs()
    pending.seen(tx({ nonce: 7 }), 100)
    pending.seen(tx({ nonce: 8, hash: '0xa' }), 100)
    pending.seen(tx({ nonce: 8, hash: '0xb' }), 150)

    pending.expire(100 + PENDING_LIFETIME + 1)

    expect(pending.list().map((b) => b.nonce)).toEqual([8])
  })

  it('keeps at most MAX_PENDING, dropping the oldest', () => {
    const pending = new PendingBlobs()
    for (let nonce = 0; nonce <= MAX_PENDING; nonce++) {
      pending.seen(tx({ nonce }), 100 + nonce)
    }

    const kept = pending.list()
    expect(kept.length).toEqual(MAX_PENDING)
    expect(kept[0]?.nonce).toEqual(1)
  })

  it('moves its version only when what is pending changes', () => {
    const pending = new PendingBlobs()
    pending.seen(tx({ nonce: 7 }), 100)
    const after = pending.version

    // heard again from another peer, unchanged
    pending.seen(tx({ nonce: 7 }), 101)
    pending.included('0xother', 1, 102)
    pending.expire(103)
    expect(pending.version).toEqual(after)

    pending.included(BASE, 7, 112)
    expect(pending.version).toEqual(after + 1)
  })

  function tx(fields: Partial<PendingTx> & { nonce: number }): PendingTx {
    return {
      projectId: 'base',
      blobs: 6,
      to: '0xff00000000000000000000000000000000008453',
      from: BASE,
      hash: `0x${fields.nonce}`,
      ...fields,
    }
  }
})
