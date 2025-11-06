export type LogLevel =
  | 'CRITICAL'
  | 'ERROR'
  | 'WARN'
  | 'INFO'
  | 'DEBUG'
  | 'TRACE'

export interface LogEntry {
  time: Date
  level: LogLevel
  message: string
  parameters: Record<string, unknown>
}

export interface LoggerTransport {
  log(entry: LogEntry): void
  flush(): void
}
