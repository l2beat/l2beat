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

/**
 * Listens to one node's mempool over a WebSocket, for the whole server, and
 * reconnects with backoff while it is wanted. Every pending transaction
 * comes whole, about ten a second, and all but the blob ones are dropped.
 */
export function createMempool(
  attribute: Promise<Attribute>,
  logger: Logger,
  url = MEMPOOL_WS,
): MempoolSource {
  let socket: WebSocket | undefined
  let listener: ((tx: PendingTx) => void) | undefined
  let failures = 0
  let retry: ReturnType<typeof setTimeout> | undefined
  let watchdog: ReturnType<typeof setTimeout> | undefined

  function connect() {
    const ws = new WebSocket(url)
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
      failures = 0
      const tx = readBlobTx(String(event.data))
      if (tx) {
        void attribute.then((attributeTo) =>
          listener?.({ ...tx, projectId: attributeTo(tx.to, tx.from) }),
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

  function feedWatchdog(ws: WebSocket) {
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

/** The blob transaction in a subscription message, if that is what it carries */
function readBlobTx(message: string): Omit<PendingTx, 'projectId'> | undefined {
  // most messages are other transactions: skip them before parsing
  if (!message.includes('"type":"0x3"')) return undefined
  const tx = (
    JSON.parse(message) as {
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
  ).params?.result
  if (tx?.type !== '0x3' || !tx.to) return undefined
  const blobs = tx.blobVersionedHashes?.length ?? 0
  if (blobs === 0) return undefined
  return {
    hash: tx.hash,
    from: tx.from.toLowerCase(),
    nonce: Number(tx.nonce),
    to: tx.to.toLowerCase(),
    blobs,
  }
}
