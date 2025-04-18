import type { LogEntry, LogFormatter } from './types'
import { toJSON } from './utils'

export class LogFormatterPlain implements LogFormatter {
  public format(entry: LogEntry): string {
    const msg = entry.message ?? ''
    const params = entry.resolvedError
      ? { ...entry.resolvedError, ...entry.parameters }
      : (entry.parameters ?? {})
    const sanitized = this.sanitize(params)
    const paramsStr = Object.keys(sanitized).length
      ? ` ${JSON.stringify(sanitized)}`
      : ''
    return `${msg}${paramsStr}`
  }

  private sanitize(parameters: object): object {
    return JSON.parse(toJSON(parameters))
  }
}
