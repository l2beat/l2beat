/** A blob transaction broadcast to the mempool and not yet in a block */
export interface PendingBatch {
  /** Missing when no project claims it */
  projectId?: string
  blobs: number
  /** Where it was sent, lowercase */
  to: string
  /** Lowercase. With the nonce, names the batch across fee-bump resends */
  from: string
  nonce: number
  /** Of its newest version: a fee bump resends it under a new hash */
  hash: string
  /** Unix seconds this server first heard of it, in any version */
  firstSeenAt: number
}

/** A blob transaction as heard from the mempool */
export type PendingTx = Omit<PendingBatch, 'firstSeenAt'>

/**
 * Long enough for a batch underpriced for a few blocks; most get in within
 * two slots. One that waits longer is likely stuck or dropped by the node,
 * which does not say so
 */
export const PENDING_LIFETIME = 180
/** Bounds what one spammer can put into every answer */
export const MAX_PENDING = 64

/**
 * The blob transactions waiting for a block, as one node's mempool tells of
 * them. A batch is named by its sender and nonce, as a fee bump resends it
 * under a new hash, and only one transaction of a nonce can be included.
 * `version` moves on whenever what is waiting changes.
 */
export class PendingBlobs {
  version = 0
  private readonly byKey = new Map<string, Tracked>()
  /**
   * The nonces each sender got into a block of late, with the slot of each
   * block. A transaction can reach the mempool after its block, and must not
   * then wait for one
   */
  private readonly usedNonces = new Map<string, Used[]>()

  /** Oldest first */
  list(): PendingBatch[] {
    return [...this.byKey.values()]
      .map(({ lastSeenAt: _, ...batch }) => batch)
      .sort((a, b) => a.firstSeenAt - b.firstSeenAt)
  }

  seen(tx: PendingTx, now: number) {
    if (this.usedNonces.get(tx.from)?.some((u) => tx.nonce <= u.nonce)) return
    const key = keyOf(tx.from, tx.nonce)
    const known = this.byKey.get(key)
    if (known) {
      known.lastSeenAt = now
      if (known.hash === tx.hash) return
      // a resend is the same batch, still waiting since it was first sent
      this.byKey.set(key, {
        ...tx,
        firstSeenAt: known.firstSeenAt,
        lastSeenAt: now,
      })
    } else {
      this.byKey.set(key, { ...tx, firstSeenAt: now, lastSeenAt: now })
      this.dropOldestOver(MAX_PENDING)
    }
    this.version++
  }

  /**
   * The block in `slot` took the sender's `nonce`: the batch is done waiting,
   * and so are any of its lower nonces, which can no longer be included. Says
   * since when the batch waited, if it was seen waiting
   */
  included(
    from: string,
    nonce: number,
    slot: number,
    now: number,
  ): number | undefined {
    this.usedNonces.set(from, [
      ...(this.usedNonces.get(from)?.filter((u) => !isUsed(u, nonce, slot)) ??
        []),
      { nonce, slot, at: now },
    ])
    const firstSeenAt = this.byKey.get(keyOf(from, nonce))?.firstSeenAt
    let changed = false
    for (const [key, batch] of this.byKey) {
      if (batch.from === from && batch.nonce <= nonce) {
        this.byKey.delete(key)
        changed = true
      }
    }
    if (changed) this.version++
    return firstSeenAt
  }

  /**
   * The chain dropped the block in `slot` that took the sender's `nonce`.
   * Unless another block took the nonce since, the batch is back in the
   * mempool and may wait again. What older blocks took stays taken
   */
  dropped(from: string, nonce: number, slot: number) {
    this.keepUsed(from, (u) => !isUsed(u, nonce, slot))
  }

  /** Lets go of batches not heard of for `PENDING_LIFETIME` */
  expire(now: number) {
    let changed = false
    for (const [key, batch] of this.byKey) {
      if (now - batch.lastSeenAt > PENDING_LIFETIME) {
        this.byKey.delete(key)
        changed = true
      }
    }
    // a late transaction comes seconds after its block, not minutes
    for (const from of this.usedNonces.keys()) {
      this.keepUsed(from, (u) => now - u.at <= PENDING_LIFETIME)
    }
    if (changed) this.version++
  }

  /** Forgets everything, as when the mempool is no longer listened to */
  clear() {
    if (this.byKey.size > 0) this.version++
    this.byKey.clear()
    this.usedNonces.clear()
  }

  private keepUsed(from: string, keep: (used: Used) => boolean) {
    const kept = this.usedNonces.get(from)?.filter(keep) ?? []
    if (kept.length > 0) this.usedNonces.set(from, kept)
    else this.usedNonces.delete(from)
  }

  private dropOldestOver(limit: number) {
    if (this.byKey.size <= limit) return
    const oldest = this.list()[0]
    if (oldest) this.byKey.delete(keyOf(oldest.from, oldest.nonce))
  }
}

/** A nonce a block took */
interface Used {
  nonce: number
  slot: number
  /** Unix seconds the block was seen */
  at: number
}

interface Tracked extends PendingBatch {
  /** A resend keeps a batch from expiring */
  lastSeenAt: number
}

function isUsed(used: Used, nonce: number, slot: number) {
  return used.nonce === nonce && used.slot === slot
}

function keyOf(from: string, nonce: number) {
  return `${from}:${nonce}`
}
