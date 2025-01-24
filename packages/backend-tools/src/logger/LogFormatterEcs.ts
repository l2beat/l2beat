import type { LogEntry, LogFormatter } from './types'
import { toJSON } from './utils'

const MAX_LENGTH = 1000

// https://www.elastic.co/guide/en/ecs/8.11/ecs-reference.html
export class LogFormatterEcs implements LogFormatter {
  public format(entry: LogEntry): string {
    const core = {
      '@timestamp': entry.time.toISOString(),
      log: {
        level: entry.level,
      },
      service: {
        name: entry.service,
      },
      labels: {
        feature: entry.feature,
        module: entry.module,
        chain: entry.chain,
        project: entry.project,
        source: entry.source,
      },
      message: entry.message ? truncate(entry.message) : undefined,
      error: entry.resolvedError
        ? {
            message: entry.resolvedError.error
              ? truncate(entry.resolvedError.error)
              : undefined,
            type: entry.resolvedError.name,
            stack_trace: entry.resolvedError.stack
              ? entry.resolvedError.stack.map(truncate)
              : undefined,
          }
        : undefined,
    }

    try {
      return toJSON({ ...core, parameters: entry.parameters })
    } catch {
      return toJSON({ ...core })
    }
  }
}

function truncate(str: string): string {
  return str.length > MAX_LENGTH ? `${str.slice(0, MAX_LENGTH)}...` : str
}
