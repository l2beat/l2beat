import { AsyncLocalStorage } from 'node:async_hooks'

type RpcMetricsContextValue = string | number | boolean

export interface RpcMetricsContext {
  coreFeature?: string
  [key: string]: RpcMetricsContextValue | undefined
}

const storage = new AsyncLocalStorage<RpcMetricsContext>()

export function withRpcMetricsContext<T>(
  context: RpcMetricsContext,
  fn: () => T,
): T {
  const current = storage.getStore()
  return storage.run({ ...current, ...sanitizeContext(context) }, fn)
}

export function getRpcMetricsContext(): RpcMetricsContext | undefined {
  return storage.getStore()
}

/** Label used when a call is made outside of any RPC metrics context. */
export const UNCATEGORIZED_METRICS_LABEL = 'uncategorized'

/**
 * Consumer label for client metrics: the active `coreFeature`, or
 * `UNCATEGORIZED_METRICS_LABEL` outside of a metrics context. Call it
 * synchronously in the consumer's async context, before handing the work to
 * a queue or rate limiter, where the context is no longer the caller's.
 */
export function getRpcMetricsLabel(): string {
  return getRpcMetricsContext()?.coreFeature ?? UNCATEGORIZED_METRICS_LABEL
}

function sanitizeContext(context: RpcMetricsContext): RpcMetricsContext {
  const sanitized: RpcMetricsContext = {}

  for (const [key, value] of Object.entries(context)) {
    if (
      value === undefined ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      sanitized[key] = value
    }
  }

  return sanitized
}
