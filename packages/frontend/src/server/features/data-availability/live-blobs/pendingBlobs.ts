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
  /**
   * Transactions heard of while a block had their nonce, kept in case the
   * chain drops that block: the node tells of a transaction back in its
   * mempool once, and that is before this server hears of the drop
   */
  private readonly refused = new Map<string, Tracked>()
  /**
   * Since when the batches blocks took had waited, kept while the chain may
   * yet drop their block: heard of again then, they waited since the first
   */
  private readonly waited = new Map<string, Waited>()

  /** Oldest first */
  list(): PendingBatch[] {
    return [...this.byKey.values()]
      .map(({ lastSeenAt: _, ...batch }) => batch)
      .sort((a, b) => a.firstSeenAt - b.firstSeenAt)
  }

  seen(tx: PendingTx, now: number) {
    const key = keyOf(tx.from, tx.nonce)
    const firstSeenAt = this.waited.get(key)?.since ?? now
    if (this.isUsed(tx.from, tx.nonce)) {
      this.refused.set(key, { ...tx, firstSeenAt, lastSeenAt: now })
      dropOldestOver(this.refused, MAX_PENDING)
      return
    }
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
      this.byKey.set(key, { ...tx, firstSeenAt, lastSeenAt: now })
      dropOldestOver(this.byKey, MAX_PENDING)
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
      ...(this.usedNonces.get(from)?.filter((u) => !isUsedBy(u, nonce, slot)) ??
        []),
      { nonce, slot, at: now },
    ])
    const key = keyOf(from, nonce)
    const firstSeenAt = this.byKey.get(key)?.firstSeenAt
    if (firstSeenAt !== undefined) {
      this.waited.set(key, { since: firstSeenAt, at: now })
    }
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
    this.keepUsed(from, (u) => !isUsedBy(u, nonce, slot))
    let restored = false
    for (const [key, tx] of this.refused) {
      if (tx.from !== from || this.isUsed(from, tx.nonce)) continue
      this.refused.delete(key)
      this.byKey.set(key, tx)
      restored = true
    }
    if (!restored) return
    dropOldestOver(this.byKey, MAX_PENDING)
    this.version++
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
    for (const [key, tx] of this.refused) {
      if (now - tx.lastSeenAt > PENDING_LIFETIME) this.refused.delete(key)
    }
    // a late transaction comes seconds after its block, not minutes
    for (const from of this.usedNonces.keys()) {
      this.keepUsed(from, (u) => now - u.at <= PENDING_LIFETIME)
    }
    for (const [key, { at }] of this.waited) {
      if (now - at > PENDING_LIFETIME) this.waited.delete(key)
    }
    if (changed) this.version++
  }

  /** Forgets everything, as when the mempool is no longer listened to */
  clear() {
    if (this.byKey.size > 0) this.version++
    this.byKey.clear()
    this.usedNonces.clear()
    this.refused.clear()
    this.waited.clear()
  }

  /** Whether a block took the nonce, or a higher one of the sender's */
  private isUsed(from: string, nonce: number) {
    return this.usedNonces.get(from)?.some((u) => nonce <= u.nonce) ?? false
  }

  private keepUsed(from: string, keep: (used: Used) => boolean) {
    const kept = this.usedNonces.get(from)?.filter(keep) ?? []
    if (kept.length > 0) this.usedNonces.set(from, kept)
    else this.usedNonces.delete(from)
  }
}

function dropOldestOver(tracked: Map<string, Tracked>, limit: number) {
  const over = tracked.size - limit
  if (over <= 0) return
  const oldestFirst = [...tracked.entries()].sort(
    ([, a], [, b]) => a.firstSeenAt - b.firstSeenAt,
  )
  for (const [key] of oldestFirst.slice(0, over)) tracked.delete(key)
}

/** A nonce a block took */
interface Used {
  nonce: number
  slot: number
  /** Unix seconds the block was seen */
  at: number
}

/** How long a batch a block took had waited */
interface Waited {
  since: number
  /** Unix seconds the block was seen */
  at: number
}

interface Tracked extends PendingBatch {
  /** A resend keeps a batch from expiring */
  lastSeenAt: number
}

function isUsedBy(used: Used, nonce: number, slot: number) {
  return used.nonce === nonce && used.slot === slot
}

function keyOf(from: string, nonce: number) {
  return `${from}:${nonce}`
}
