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
  const timer = idleTimer(timeout, () =>
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
    throw unwrapFetchFailed(error)
  }
}

// undici reports every network failure as this one TypeError and hides the reason in `cause`
function unwrapFetchFailed(error: unknown): unknown {
  if (
    error instanceof TypeError &&
    error.message === 'fetch failed' &&
    error.cause instanceof Error
  ) {
    return withReadableMessage(error.cause)
  }
  return error
}

// happy-eyeballs connects fail with an AggregateError whose message is empty
function withReadableMessage(cause: Error): Error {
  if (cause instanceof AggregateError && !cause.message) {
    const messages = cause.errors.map((e) =>
      e instanceof Error ? e.message : String(e),
    )
    return new AggregateError(cause.errors, messages.join('; '))
  }
  return cause
}

// unref: a request nobody is reading anymore must not keep a CLI alive
function idleTimer(ms: number, onTimeout: () => void) {
  let handle = setTimeout(onTimeout, ms).unref()
  const stop = () => clearTimeout(handle)
  const restart = () => {
    stop()
    handle = setTimeout(onTimeout, ms).unref()
  }
  const restartPerChunk = () =>
    new TransformStream<Uint8Array, Uint8Array>({
      transform: (chunk, controller) => {
        restart()
        controller.enqueue(chunk)
      },
      flush: stop,
    })
  return { stop, restartPerChunk }
}
