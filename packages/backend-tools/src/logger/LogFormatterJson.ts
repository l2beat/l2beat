import { LogEntry, LogFormatter } from './interfaces'
import { toJSON } from './toJSON'

export class LogFormatterJson implements LogFormatter {
  public format(entry: LogEntry): string {
    const core = {
      time: entry.time.toISOString(),
      level: entry.level,
      service: entry.service,
      message: entry.message,
      error: entry.resolvedError,
    }

    try {
      return toJSON({ ...core, parameters: entry.parameters })
    } catch {
      return toJSON({ ...core })
    }
  }
}
