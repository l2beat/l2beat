import type { Logger } from '@l2beat/backend-tools'

export interface RetryOptions {
  initialTimeoutMs: number
  maxAttempts: number
  maxTimeoutMs?: number
  logger?: Logger
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
    try {
      if (attempt === 1 && firstResult) {
        return await firstResult
      }
      return await callback()
    } catch (error) {
      if (attempt >= options.maxAttempts) {
        throw error
      }
      options.logger?.warn('Retrying', { attempt, error })
      await new Promise((resolve) => setTimeout(resolve, nextTimeout))
      nextTimeout = Math.min(maxTimeoutMs, nextTimeout * 2)
    }
  }
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
        !options.exclude?.includes(name)
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
