import type { Logger } from '@l2beat/backend-tools'
import type { Database, LivePendingBlobTxRecord } from '@l2beat/database'
import type { EthSubscription } from '../../../../tools/EthSubscription'
import { attributeBatch, type LiveBlobsConfig, nowSeconds } from './liveBlobs'

/** Of `eth_subscribe`: every pending transaction, whole */
export const PENDING_TXS = ['newPendingTransactions', true]
/** The node sends several transactions a second; this long silent, the line is dead */
export const PENDING_SILENT_FOR = 30
/**
 * Long enough for a batch underpriced for a few blocks; most get in within
 * two slots. One unheard of for longer is likely stuck or dropped by the
 * node, which does not say so. Kept this long after its block too, so that
 * it waits again if the chain drops the block
 */
const PENDING_LIFETIME = 180
const CLEANUP_EVERY = 10
/** A pending transaction has no block yet: the configs still in force claim it */
const IN_FORCE_NOW = Number.MAX_SAFE_INTEGER

export interface LiveMempoolListenerDependencies {
  /** To `PENDING_TXS` */
  pendingTxs: Pick<EthSubscription, 'start'>
  db: Database
  configurations: LiveBlobsConfig[]
  /** Unix seconds, with the fraction */
  now?: () => number
}

/**
 * Listens to one node's mempool for the live blobs view, and stores the blob
 * transactions it tells of, so the view can show batches waiting for a
 * block. Whether a block took one is the view's to ask, as the blocks are
 * stored apart: a transaction heard of after its block, or one whose block the
 * chain dropped, then shows as it should with nothing kept here.
 */
export class LiveMempoolListener {
  /** Upserts in the order heard, so a resend is never overwritten by what it replaced */
  private writing = Promise.resolve()
  private writeFailing = false
  private readonly logger: Logger

  constructor(
    private readonly $: LiveMempoolListenerDependencies,
    logger: Logger,
  ) {
    this.logger = logger.for(this).tag({ tag: 'ethereum' })
  }

  start() {
    this.$.pendingTxs.start((result) => {
      const tx = readBlobTx(result)
      if (tx) this.store(tx)
    })
    setInterval(() => void this.cleanUp(), CLEANUP_EVERY * 1000).unref()
  }

  private store(tx: PendingBlobTx) {
    const now = (this.$.now ?? nowSeconds)()
    const record: LivePendingBlobTxRecord = {
      ...tx,
      projectId: attributeBatch(this.$.configurations, IN_FORCE_NOW, {
        ...tx,
        // only a block's receipts tell the events a transaction emits
        topics: [],
      }),
      firstSeenAt: now,
      lastSeenAt: now,
    }
    this.writing = this.writing
      .then(() => this.$.db.livePendingBlobTx.upsert(record))
      .then(
        () => {
          this.writeFailing = false
        },
        (error) => {
          // logged once per outage, not on every transaction
          if (!this.writeFailing) {
            this.logger.warn('Pending blob tx not stored', { error })
          }
          this.writeFailing = true
        },
      )
  }

  private async cleanUp() {
    const now = (this.$.now ?? nowSeconds)()
    try {
      await this.$.db.livePendingBlobTx.deleteSeenBefore(now - PENDING_LIFETIME)
    } catch (error) {
      this.logger.warn('Expired pending blob txs not deleted', { error })
    }
  }
}

/** A blob transaction as the mempool tells of it */
export type PendingBlobTx = Pick<
  LivePendingBlobTxRecord,
  'from' | 'nonce' | 'txHash' | 'to' | 'blobs'
>

/**
 * The blob transaction a pending transaction event tells of, if it is one.
 * Addresses are lowercase, as the stored blocks' are, so that the two can be
 * matched
 */
export function readBlobTx(result: unknown): PendingBlobTx | undefined {
  const tx = result as
    | {
        type?: string
        hash: string
        from: string
        to: string | null
        nonce: string
        blobVersionedHashes?: string[]
      }
    | undefined
  const blobs = tx?.blobVersionedHashes?.length ?? 0
  if (tx?.type !== '0x3' || !tx.to || blobs === 0) return undefined
  return {
    from: tx.from.toLowerCase(),
    nonce: Number(tx.nonce),
    txHash: tx.hash,
    to: tx.to.toLowerCase(),
    blobs,
  }
}
