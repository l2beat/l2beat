import type { Logger } from '@l2beat/backend-tools'
import type { Attribute } from './attribute'
import type { PendingTx } from './pendingBlobs'

/**
 * A public node that streams whole pending transactions. Its beacon API
 * will not stream events, so the mempool is the only place blobs show
 * before their block does
 */
const MEMPOOL_WS = 'wss://ethereum-rpc.publicnode.com'
/** The node sends several transactions a second; this long silent, the line is dead */
const SILENT_FOR = 30
const FIRST_RETRY_DELAY = 1
const MAX_RETRY_DELAY = 30
const SUBSCRIBE_ID = 1

/** Where pending blob transactions come from */
export interface MempoolSource {
  /** Starts listening, unless it is already; `onBlobTx` hears every blob transaction broadcast */
  watch(onBlobTx: (tx: PendingTx) => void): void
  stop(): void
}

/** What is used of a WebSocket, so a test can stand one in */
export interface Socket {
  onopen: ((event: Event) => void) | null
  onmessage: ((event: MessageEvent) => void) | null
  onclose: ((event: CloseEvent) => void) | null
  send(data: string): void
  close(): void
}

/**
 * Listens to one node's mempool over a WebSocket, for the whole server, and
 * reconnects with backoff while it is wanted. Every pending transaction
 * comes whole, about ten a second, and all but the blob ones are dropped.
 */
export function createMempool(
  attribute: Promise<Attribute>,
  logger: Logger,
  url = MEMPOOL_WS,
  open: (url: string) => Socket = (url) => new WebSocket(url),
): MempoolSource {
  let socket: Socket | undefined
  let listener: ((tx: PendingTx) => void) | undefined
  let failures = 0
  let retry: ReturnType<typeof setTimeout> | undefined
  let watchdog: ReturnType<typeof setTimeout> | undefined

  function connect() {
    const ws = open(url)
    socket = ws
    // a connection that hangs before it opens is dead too
    feedWatchdog(ws)
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          id: SUBSCRIBE_ID,
          method: 'eth_subscribe',
          params: ['newPendingTransactions', true],
        }),
      )
      feedWatchdog(ws)
    }
    ws.onmessage = (event) => {
      feedWatchdog(ws)
      const told = readPendingTx(String(event.data))
      // a node that takes the subscription and then closes has not come back:
      // only the stream flowing says so, and resets the backoff
      if (!told) return
      failures = 0
      if (told.blobTx) {
        const blobTx = told.blobTx
        attribute.then(
          (attributeTo) =>
            listener?.({
              ...blobTx,
              projectId: attributeTo(blobTx.to, blobTx.from),
            }),
          // the block feed reports the senders failing to load; here it
          // would only crash the process as an unhandled rejection
          () => {},
        )
      }
    }
    ws.onclose = () => {
      if (socket !== ws) return
      socket = undefined
      clearTimeout(watchdog)
      // logged once per outage, not on every retry
      if (failures === 0) logger.warn('Mempool stream closed')
      failures++
      const delay = Math.min(
        MAX_RETRY_DELAY,
        FIRST_RETRY_DELAY * 2 ** (failures - 1),
      )
      retry = setTimeout(connect, delay * 1000)
      retry.unref()
    }
  }

  function feedWatchdog(ws: Socket) {
    clearTimeout(watchdog)
    watchdog = setTimeout(() => ws.close(), SILENT_FOR * 1000)
    watchdog.unref()
  }

  return {
    watch(onBlobTx) {
      listener = onBlobTx
      if (socket || retry) return
      connect()
    },
    stop() {
      listener = undefined
      clearTimeout(retry)
      clearTimeout(watchdog)
      retry = undefined
      const ws = socket
      socket = undefined
      ws?.close()
    },
  }
}

/** The subscription telling of a pending transaction, with it if it is a blob one */
export interface PendingTold {
  blobTx: Omit<PendingTx, 'projectId'> | undefined
}

/**
 * What a message from the node tells: a pending transaction, or nothing of
 * the kind (the subscription's acknowledgement, an error). Parsed whole, as
 * JSON is free with whitespace and a search for `"type":"0x3"` is not
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
      hash: tx.hash,
      from: tx.from.toLowerCase(),
      nonce: Number(tx.nonce),
      to: tx.to.toLowerCase(),
      blobs,
    },
  }
}
