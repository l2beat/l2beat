import type { LogEntry } from './types'
import { safeToJSON, tagService } from './utils'

const MAX_LENGTH = 1000

// https://www.elastic.co/guide/en/ecs/8.11/ecs-reference.html
export function formatEcsLog(entry: LogEntry): string {
  const { service, tag, error, ...rest } = entry.parameters

  let feature: string | undefined
  let module: string | undefined
  let chain: string | undefined
  let project: string | undefined
  let source: string | undefined
  if (typeof rest.feature === 'string') {
    feature = rest.feature
    // biome-ignore lint/performance/noDelete: desired behaviour
    delete rest.feature
  }
  if (typeof rest.module === 'string') {
    module = rest.module
    // biome-ignore lint/performance/noDelete: desired behaviour
    delete rest.module
  }
  if (typeof rest.chain === 'string') {
    chain = rest.chain
    // biome-ignore lint/performance/noDelete: desired behaviour
    delete rest.chain
  }
  if (typeof rest.project === 'string') {
    project = rest.project
    // biome-ignore lint/performance/noDelete: desired behaviour
    delete rest.project
  }
  if (typeof rest.source === 'string') {
    source = rest.source
    // biome-ignore lint/performance/noDelete: desired behaviour
    delete rest.source
  }

  return safeToJSON({
    '@timestamp': entry.time.toISOString(),
    log: {
      level: entry.level,
    },
    service: {
      name: tagService(service, tag),
    },
    labels: {
      feature: feature,
      module: module,
      chain: chain,
      project: project,
      source: source,
    },
    message: truncate(entry.message),
    error:
      typeof error === 'object' && error !== null && !Array.isArray(error)
        ? {
            message: truncate((error as Record<string, unknown>).error),
            type: (error as Record<string, unknown>).name,
            stack_trace: Array.isArray((error as Record<string, unknown>).stack)
              ? ((error as Record<string, unknown>).stack as unknown[]).map(
                  truncate,
                )
              : undefined,
          }
        : undefined,
    parameters: hasKeys(rest) ? rest : undefined,
  })
}

function hasKeys(object: Record<string, unknown>): boolean {
  for (const _ in object) {
    return true
  }
  return false
}

function truncate(str: unknown): string {
  if (typeof str !== 'string') {
    return ''
  }
  return str.length > MAX_LENGTH ? `${str.slice(0, MAX_LENGTH)}...` : str
}
