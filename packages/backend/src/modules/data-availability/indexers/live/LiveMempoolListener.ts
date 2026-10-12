import type { Logger } from '@l2beat/backend-tools'
import type { Database, LivePendingBlobTxRecord } from '@l2beat/database'
import { type RawData, WebSocket } from 'ws'
import { attributeBatch, type LiveBlobsConfig, nowSeconds } from './liveBlobs'

/** The node sends several transactions a second; this long silent, the line is dead */
const SILENT_FOR = 30
const FIRST_RETRY_DELAY = 1
const MAX_RETRY_DELAY = 30
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
const SUBSCRIBE_ID = 1

export interface LiveMempoolListenerDependencies {
  /** A node that streams whole pending transactions over a WebSocket */
  url: string
  db: Database
  configurations: LiveBlobsConfig[]
  /** Unix seconds, with the fraction */
  now?: () => number
  openSocket?: (url: string) => WebSocket
}

/**
 * Listens to one node's mempool for the live blobs view, and stores the blob
 * transactions it tells of, so the view can show batches waiting for a
 * block. Whether a block took one is the view's to ask, as the blocks are
 * stored apart: a transaction heard of after its block, or one whose block the
 * chain dropped, then shows as it should with nothing kept here.
 */
export class LiveMempoolListener {
  private socket: WebSocket | undefined
  private failures = 0
  private watchdog: ReturnType<typeof setTimeout> | undefined
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
    this.connect()
    setInterval(() => void this.cleanUp(), CLEANUP_EVERY * 1000).unref()
  }

  private connect() {
    const ws = (this.$.openSocket ?? ((url) => new WebSocket(url)))(this.$.url)
    this.socket = ws
    // a connection that hangs before it opens is dead too
    this.feedWatchdog(ws)
    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          id: SUBSCRIBE_ID,
          method: 'eth_subscribe',
          params: ['newPendingTransactions', true],
        }),
      )
    })
    ws.on('message', (data) => this.onMessage(ws, data))
    // closing follows, and reconnects
    ws.on('error', () => {})
    ws.on('close', () => this.onClose(ws))
  }

  private onMessage(ws: WebSocket, data: RawData) {
    this.feedWatchdog(ws)
    const told = readPendingTx(data.toString())
    // a node that takes the subscription and then closes has not come back:
    // only the stream flowing says so, and resets the backoff
    if (!told) return
    if (this.failures > 0) this.logger.info('Mempool stream back')
    this.failures = 0
    if (told.blobTx) this.store(told.blobTx)
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

  private onClose(ws: WebSocket) {
    if (this.socket !== ws) return
    this.socket = undefined
    clearTimeout(this.watchdog)
    // logged once per outage, not on every retry
    if (this.failures === 0) this.logger.warn('Mempool stream closed')
    this.failures++
    const delay = Math.min(
      MAX_RETRY_DELAY,
      FIRST_RETRY_DELAY * 2 ** (this.failures - 1),
    )
    setTimeout(() => this.connect(), delay * 1000).unref()
  }

  private feedWatchdog(ws: WebSocket) {
    clearTimeout(this.watchdog)
    this.watchdog = setTimeout(() => ws.terminate(), SILENT_FOR * 1000)
    this.watchdog.unref()
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

/** The subscription telling of a pending transaction, with it if it is a blob one */
export interface PendingTold {
  blobTx: PendingBlobTx | undefined
}

/**
 * What a message from the node tells: a pending transaction, or nothing of
 * the kind (the subscription's acknowledgement, an error). Addresses are
 * lowercase, as the stored blocks' are, so that the two can be matched
 */
export function readPendingTx(message: string): PendingTold | undefined {
  let parsed: {
    method?: string
    params?: {
      result?: {
        type?: string
        hash: string
        from: string
        to: string | null
        nonce: string
        blobVersionedHashes?: string[]
      }
    }
  }
  try {
    parsed = JSON.parse(message)
  } catch {
    return undefined
  }
  if (parsed.method !== 'eth_subscription') return undefined
  const tx = parsed.params?.result
  const blobs = tx?.blobVersionedHashes?.length ?? 0
  if (tx?.type !== '0x3' || !tx.to || blobs === 0) return { blobTx: undefined }
  return {
    blobTx: {
      from: tx.from.toLowerCase(),
      nonce: Number(tx.nonce),
      txHash: tx.hash,
      to: tx.to.toLowerCase(),
      blobs,
    },
  }
}
