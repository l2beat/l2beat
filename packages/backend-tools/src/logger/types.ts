export type LogLevel =
  | 'CRITICAL'
  | 'ERROR'
  | 'WARN'
  | 'INFO'
  | 'DEBUG'
  | 'TRACE'

export interface LoggerTransport {
  log(
    time: Date,
    level: LogLevel,
    message: string,
    parameters: Record<string, unknown>,
  ): void
  flush(): void
}

export type LogFormatter = (
  time: Date,
  level: LogLevel,
  message: string,
  parameters: Record<string, unknown>,
) => string
