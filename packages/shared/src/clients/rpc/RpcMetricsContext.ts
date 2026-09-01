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
