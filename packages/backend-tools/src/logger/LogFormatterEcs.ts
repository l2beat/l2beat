import { LogEntry, LogFormatter } from './types'
import { toJSON } from './utils'

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
      message: entry.message,
      error: entry.resolvedError
        ? {
            message: entry.resolvedError.error,
            type: entry.resolvedError.name,
            stack_trace: entry.resolvedError.stack,
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
