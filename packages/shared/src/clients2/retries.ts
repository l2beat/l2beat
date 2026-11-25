import type { Logger } from '@l2beat/backend-tools'

export interface RetryOptions {
  initialTimeoutMs: number
  maxAttempts: number
  maxTimeoutMs?: number
  logger?: Logger
  signal?: AbortSignal
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export async function retry<T>(
  callback: () => Promise<T>,
  options: RetryOptions,
  firstResult?: Promise<T>,
): Promise<T> {
  const maxTimeoutMs = options.maxTimeoutMs ?? ONE_DAY_MS
  let nextTimeout = options.initialTimeoutMs
  for (let attempt = 1; ; attempt++) {
    if (options.signal?.aborted) {
      throw options.signal.reason
    }
    try {
      if (attempt === 1 && firstResult) {
        return await firstResult
      }
      return await callback()
    } catch (error) {
      if (options.signal?.aborted || attempt >= options.maxAttempts) {
        throw error
      }
      options.logger?.warn('Retrying', { attempt, error })
      await sleepWithSignal(nextTimeout, options.signal)
      nextTimeout = Math.min(maxTimeoutMs, nextTimeout * 2)
    }
  }
}

function sleepWithSignal(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal === undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  if (signal.aborted) {
    return Promise.reject(signal.reason)
  }
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer)
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

function wrapRetry<T>(
  self: T,
  cb: (this: T, ...args: unknown[]) => unknown,
  options: RetryOptions,
): typeof cb {
  return function wrapped(...args: unknown[]) {
    const result = cb.apply(self, args)
    if (!(result instanceof Promise)) {
      return result
    }
    return retry(
      () => cb.apply(self, args) as Promise<unknown>,
      options,
      result,
    )
  }
}

export interface WithRetriesOptions extends RetryOptions {
  exclude?: string[]
}

export function withRetries<T extends object>(
  service: T,
  options: WithRetriesOptions,
): T {
  const wrapper = new Map<string, (...args: unknown[]) => unknown>()
  let current = service
  while (current !== Object.prototype && current !== null) {
    for (const name of Object.getOwnPropertyNames(current)) {
      const value = Reflect.get(current, name)
      if (
        name !== 'constructor' &&
        typeof value === 'function' &&
        !options.exclude?.includes(name) &&
        // This loop walks the prototype chain from the instance *upward*, so
        // without the following line a parent method can overwrite a child
        // override in the wrapper map. The goal of withRetries is to be
        // behavior‑preserving (except for retry), so it should respect normal JS
        // method lookup: the most‑derived property wins. Because the wrapper map
        // is built by walking the prototype chain, you need !wrapper.has(name) to
        // ensure "first found wins". Without it, a parent method can replace a
        // child override and you’d change what actually runs.
        !wrapper.has(name)
      ) {
        wrapper.set(
          name,
          wrapRetry(service, value as (...args: unknown[]) => unknown, options),
        )
      }
    }
    current = Object.getPrototypeOf(current)
  }

  return new Proxy(service, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        const wrapped = wrapper.get(prop)
        if (wrapped) return wrapped
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}
