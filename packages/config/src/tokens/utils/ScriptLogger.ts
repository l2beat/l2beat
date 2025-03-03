import chalk from 'chalk'

export interface LoggerOptions {
  enabled: boolean
  prefix?: string
  metadata?: string[]
}

export class ScriptLogger {
  private readonly options: LoggerOptions

  constructor(options: Partial<LoggerOptions>) {
    this.options = {
      enabled: true,
      ...options,
    }
  }

  static SILENT = new ScriptLogger({ enabled: false })

  configure(options: Partial<LoggerOptions>): ScriptLogger {
    return new ScriptLogger({ ...this.options, ...options })
  }

  prefix(prefix: string | undefined): ScriptLogger {
    return this.configure({ prefix })
  }

  addMetadata(...metadata: string[]): ScriptLogger {
    return this.configure({
      metadata: [...(this.options.metadata ?? []), ...metadata],
    })
  }

  fetching(...messages: string[]) {
    this.logColored('yellow', 'Fetching...', ...messages)
  }

  processing(...messages: string[]) {
    this.logColored('yellow', 'Processing...', ...messages)
  }

  processed(...messages: string[]) {
    this.logColored('green', 'Processed', ...messages)
  }

  notify(notification: string, ...messages: string[]) {
    this.logColored('yellow', notification, ...messages)
  }

  success(notification: string, ...messages: string[]) {
    this.logColored('green', notification, ...messages)
  }

  skipping(...messages: string[]) {
    this.logColored('gray', 'Skipping', ...messages)
  }

  overriding(...messages: string[]) {
    this.logColored('yellow', 'Overriding', ...messages)
  }

  assert(condition: boolean, ...messages: string[]): asserts condition {
    if (condition) return

    this.logColored('red', 'Error', ...messages)
    process.exit(1)
  }

  log(...messages: string[]) {
    if (!this.options.enabled) return
    console.log(...messages, ...(this.options.metadata ?? []))
  }

  private logColored(
    color: 'red' | 'green' | 'yellow' | 'blue' | 'gray',
    notification: string,
    ...messages: string[]
  ) {
    this.log(this.formatNotification(notification, color), ...messages)
  }

  private formatNotification(
    notification: string,
    color: 'red' | 'green' | 'yellow' | 'blue' | 'gray',
  ) {
    const withPrefix = `[${this.options.prefix ?? ''}] ${chalk[color](
      notification,
    )}`

    return this.options.prefix ? withPrefix : chalk[color](notification)
  }
}
