import { sanitizeUrl } from './sanitizeUrl'

export const DEFAULT_TIMEOUT_MS = 10_000

export type FetchInit = RequestInit & {
  /**
   * Idle timeout in milliseconds: the clock restarts every time a chunk of the
   * response arrives, so a slow but alive download is not killed while a dead
   * connection still is. This mirrors node-fetch v2, which the clients were
   * tuned against. `0` disables the timeout.
   */
  timeout?: number
}

export class HttpTimeoutError extends Error {
  constructor(
    readonly url: string,
    readonly timeoutMs: number,
  ) {
    super(`Timeout: no data from ${sanitizeUrl(url)} for ${timeoutMs}ms`)
    this.name = 'HttpTimeoutError'
  }
}

/**
 * Native fetch with node-fetch-like idle timeout and readable errors.
 *
 * Why not `AbortSignal.timeout`: it is a wall-clock limit over the whole
 * exchange including the body read, so large responses on slow providers fail
 * deterministically once they exceed it. That silently stalled every indexer
 * the last time node-fetch was removed (see PR #5978 / #5996).
 */
export async function fetchWithTimeout(
  url: string,
  init: FetchInit,
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...rest } = init
  if (timeout === 0) {
    return await fetchOrDescribe(url, rest)
  }

  const controller = new AbortController()
  const timer = new IdleTimer(timeout, () =>
    controller.abort(new HttpTimeoutError(url, timeout)),
  )
  const signal = rest.signal
    ? AbortSignal.any([rest.signal, controller.signal])
    : controller.signal

  const response = await fetchOrDescribe(url, { ...rest, signal })
  if (!response.body) {
    timer.stop()
    return response
  }
  return new Response(response.body.pipeThrough(timer.resetOnChunk()), response)
}

/** Replaces undici's bare `TypeError: fetch failed` with the url and reason. */
async function fetchOrDescribe(url: string, init: RequestInit) {
  try {
    return await fetch(url, init)
  } catch (error) {
    throw describeFetchError(url, error)
  }
}

function describeFetchError(url: string, error: unknown): unknown {
  if (
    !(error instanceof TypeError) ||
    error.message !== 'fetch failed' ||
    !(error.cause instanceof Error)
  ) {
    return error
  }
  const reason = describeCause(error.cause)
  return new Error(`Request to ${sanitizeUrl(url)} failed: ${reason}`, {
    cause: error.cause,
  })
}

// AggregateError (happy-eyeballs connects) carries the detail in `errors`, not `message`
function describeCause(cause: Error): string {
  if (cause instanceof AggregateError && cause.errors.length > 0) {
    return cause.errors
      .map((e: unknown) => describeCause(e as Error))
      .join('; ')
  }
  const { code, message, name } = cause as Error & { code?: string }
  return message || code || name
}

class IdleTimer {
  private handle: NodeJS.Timeout

  constructor(
    private readonly ms: number,
    private readonly onTimeout: () => void,
  ) {
    this.handle = this.start()
  }

  resetOnChunk(): TransformStream<Uint8Array, Uint8Array> {
    return new TransformStream({
      transform: (chunk, controller) => {
        this.restart()
        controller.enqueue(chunk)
      },
      flush: () => this.stop(),
    })
  }

  restart() {
    clearTimeout(this.handle)
    this.handle = this.start()
  }

  stop() {
    clearTimeout(this.handle)
  }

  // unref: a request nobody is reading anymore must not keep a CLI alive
  private start() {
    return setTimeout(this.onTimeout, this.ms).unref()
  }
}
