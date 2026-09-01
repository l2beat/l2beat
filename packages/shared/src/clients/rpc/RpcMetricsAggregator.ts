import type { Logger } from '@l2beat/backend-tools'
import { getRpcMetricsContext } from './RpcMetricsContext'

export interface RpcMetricsAggregatorOptions {
  logger: Logger
  flushIntervalMs?: number
}

export interface RpcMetricsRecorder {
  record(metric: RpcMetricsRecord): void
}

export interface RpcMetricsRecord {
  method: string
  count?: number
}

export interface RpcMetricsStaticFields {
  rpcChain?: string
  rpcClient: string
}

interface AggregatedRpcMetric {
  count: number
  key: Record<string, string | number | boolean>
}

const FIELD_ORDER = [
  'coreFeature',
  'chain',
  'daLayer',
  'mode',
  'plugin',
  'pluginCluster',
  'rpcChain',
  'rpcClient',
  'rpcMethod',
] as const

export class RpcMetricsAggregator {
  static metricsEnabled = true

  static setMetricsEnabled(value: boolean) {
    RpcMetricsAggregator.metricsEnabled = value
  }

  private readonly flushIntervalMs: number
  private readonly groups = new Map<string, AggregatedRpcMetric>()

  constructor(private readonly options: RpcMetricsAggregatorOptions) {
    this.flushIntervalMs = options.flushIntervalMs ?? 60_000

    if (RpcMetricsAggregator.metricsEnabled) {
      this.start()
    }
  }

  createRecorder(staticFields: RpcMetricsStaticFields): RpcMetricsRecorder {
    return {
      record: (metric) => this.record(staticFields, metric),
    }
  }

  flush(): void {
    if (this.groups.size === 0) {
      return
    }

    const metrics = [...this.groups.values()].sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count
      }

      return serializeKey(a.key).localeCompare(serializeKey(b.key))
    })

    this.groups.clear()

    for (const metric of metrics) {
      this.options.logger.info('Rpc metrics', {
        ...metric.key,
        count: metric.count,
        intervalMs: this.flushIntervalMs,
      })
    }
  }

  private record(
    staticFields: RpcMetricsStaticFields,
    metric: RpcMetricsRecord,
  ): void {
    if (!RpcMetricsAggregator.metricsEnabled) {
      return
    }

    const key = orderFields(
      sanitizeFields({
        ...(getRpcMetricsContext() ?? {}),
        ...staticFields,
        rpcMethod: metric.method,
      }),
    )
    const serializedKey = serializeKey(key)
    const aggregated = this.groups.get(serializedKey) ?? {
      count: 0,
      key,
    }

    aggregated.count += metric.count ?? 1

    this.groups.set(serializedKey, aggregated)
  }

  private start(): void {
    const interval = setInterval(() => this.flush(), this.flushIntervalMs)
    interval.unref()
  }
}

function sanitizeFields(
  fields: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {}

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      sanitized[key] = value
    }
  }

  return sanitized
}

function orderFields(
  fields: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(fields).sort(([a], [b]) => compareFieldNames(a, b)),
  )
}

function serializeKey(key: Record<string, string | number | boolean>): string {
  return Object.entries(key)
    .sort(([a], [b]) => compareFieldNames(a, b))
    .map(([field, value]) => `${field}:${String(value)}`)
    .join('|')
}

function compareFieldNames(a: string, b: string): number {
  const aOrder = FIELD_ORDER.indexOf(a as (typeof FIELD_ORDER)[number])
  const bOrder = FIELD_ORDER.indexOf(b as (typeof FIELD_ORDER)[number])

  if (aOrder !== -1 && bOrder !== -1) {
    return aOrder - bOrder
  }
  if (aOrder !== -1) {
    return -1
  }
  if (bOrder !== -1) {
    return 1
  }

  return a.localeCompare(b)
}
