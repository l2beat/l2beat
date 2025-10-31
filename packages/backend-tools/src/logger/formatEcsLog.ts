import type { LogLevel } from './types'
import { safeToJSON, tagService } from './utils'

const MAX_LENGTH = 1000

// https://www.elastic.co/guide/en/ecs/8.11/ecs-reference.html
export function formatEcsLog(
  time: Date,
  level: LogLevel,
  message: string,
  parameters: Record<string, unknown>,
): string {
  const { service, tag, error, ...rest } = parameters

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
    '@timestamp': time.toISOString(),
    log: {
      level: level,
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
    message: truncate(message),
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
