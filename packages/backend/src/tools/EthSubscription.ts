import type { Logger } from '@l2beat/backend-tools'
import { type RawData, WebSocket } from 'ws'

const FIRST_RETRY_DELAY = 1
const MAX_RETRY_DELAY = 30
const SUBSCRIBE_ID = 1

export interface EthSubscriptionOptions {
  /** A node's WebSocket */
  url: string
  /** Of `eth_subscribe`, as `['newHeads']` */
  params: unknown[]
  /**
   * Seconds without a message after which the line counts as dead. Longer
   * than the stream's longest quiet spell, as a socket can stop delivering
   * without closing
   */
  silentFor: number
  /** Names the stream in the logs */
  name: string
  openSocket?: (url: string) => WebSocket
}

/**
 * One `eth_subscribe` to a node, kept open for the life of the process: it
 * reconnects with backoff, and drops a line that went silent to open another.
 * Events missed while the line was down are gone; whoever listens has to
 * catch up by other means.
 */
export class EthSubscription {
  private socket: WebSocket | undefined
  private failures = 0
  private watchdog: ReturnType<typeof setTimeout> | undefined
  private lastEventAt: number | undefined
  private onEvent: (result: unknown) => void = () => {}
  private readonly logger: Logger

  constructor(
    private readonly options: EthSubscriptionOptions,
    logger: Logger,
  ) {
    this.logger = logger.for(this).tag({ tag: options.name })
  }

  /** `onEvent` hears the `result` of every event */
  start(onEvent: (result: unknown) => void) {
    this.onEvent = onEvent
    this.connect()
  }

  /** Whether events arrive: one came within `silentFor` */
  isFlowing(): boolean {
    return (
      this.lastEventAt !== undefined &&
      Date.now() - this.lastEventAt < this.options.silentFor * 1000
    )
  }

  private connect() {
    const open = this.options.openSocket ?? ((url) => new WebSocket(url))
    const ws = open(this.options.url)
    this.socket = ws
    // a connection that hangs before it opens is dead too
    this.feedWatchdog(ws)
    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          id: SUBSCRIBE_ID,
          method: 'eth_subscribe',
          params: this.options.params,
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
    const event = readEvent(data.toString())
    // a node that takes the subscription and then closes has not come back:
    // only events flowing say so, and reset the backoff
    if (!event) return
    if (this.failures > 0) this.logger.info('Stream back')
    this.failures = 0
    this.lastEventAt = Date.now()
    this.onEvent(event.result)
  }

  private onClose(ws: WebSocket) {
    if (this.socket !== ws) return
    this.socket = undefined
    this.lastEventAt = undefined
    clearTimeout(this.watchdog)
    // logged once per outage, not on every retry
    if (this.failures === 0) this.logger.warn('Stream closed')
    this.failures++
    const delay = Math.min(
      MAX_RETRY_DELAY,
      FIRST_RETRY_DELAY * 2 ** (this.failures - 1),
    )
    setTimeout(() => this.connect(), delay * 1000).unref()
  }

  private feedWatchdog(ws: WebSocket) {
    clearTimeout(this.watchdog)
    this.watchdog = setTimeout(
      () => ws.terminate(),
      this.options.silentFor * 1000,
    )
    this.watchdog.unref()
  }
}

/**
 * An event of the subscription, or nothing for the other messages a node
 * sends (the subscription's acknowledgement, an error). Parsed whole, as JSON
 * is free with whitespace
 */
function readEvent(message: string): { result: unknown } | undefined {
  let parsed: { method?: string; params?: { result?: unknown } }
  try {
    parsed = JSON.parse(message)
  } catch {
    return undefined
  }
  if (parsed.method !== 'eth_subscription') return undefined
  return { result: parsed.params?.result }
}
