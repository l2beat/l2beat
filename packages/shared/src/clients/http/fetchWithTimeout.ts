import { pipeBody } from './pipeBody'
import { sanitizeUrl } from './sanitizeUrl'

const DEFAULT_TIMEOUT_MS = 10_000

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
  constructor(url: string, timeoutMs: number) {
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
    return await fetchWithReadableErrors(url, rest)
  }

  const controller = new AbortController()
  const timer = new IdleTimer(timeout, () =>
    controller.abort(new HttpTimeoutError(url, timeout)),
  )
  const signal = rest.signal
    ? AbortSignal.any([rest.signal, controller.signal])
    : controller.signal

  const response = await fetchWithReadableErrors(url, { ...rest, signal })
  if (!response.body) {
    timer.stop()
  }
  return pipeBody(response, timer.restartPerChunk())
}

async function fetchWithReadableErrors(url: string, init: RequestInit) {
  try {
    return await fetch(url, init)
  } catch (error) {
    if (!isBareFetchFailed(error)) {
      throw error
    }
    const reason = describeCause(error.cause)
    throw new Error(`Request to ${sanitizeUrl(url)} failed: ${reason}`, {
      cause: error.cause,
    })
  }
}

// undici reports every network failure as this one TypeError, hiding the reason in `cause`
function isBareFetchFailed(
  error: unknown,
): error is TypeError & { cause: unknown } {
  return (
    error instanceof TypeError &&
    error.message === 'fetch failed' &&
    error.cause !== undefined
  )
}

// happy-eyeballs connects fail with an AggregateError whose detail lives in `errors`
function describeCause(cause: unknown): string {
  if (cause instanceof AggregateError && cause.errors.length > 0) {
    return cause.errors.map(describeCause).join('; ')
  }
  if (cause instanceof Error) {
    return cause.message || cause.name
  }
  return String(cause)
}

class IdleTimer {
  private handle: NodeJS.Timeout

  constructor(
    private readonly ms: number,
    private readonly onTimeout: () => void,
  ) {
    this.handle = this.start()
  }

  restartPerChunk(): TransformStream<Uint8Array, Uint8Array> {
    return new TransformStream({
      transform: (chunk, controller) => {
        this.restart()
        controller.enqueue(chunk)
      },
      flush: () => this.stop(),
    })
  }

  restart() {
    this.stop()
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
