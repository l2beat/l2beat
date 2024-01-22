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

  notify(notification: string, ...messages: string[]) {
    this.log(this.formatNotification(notification, 'yellow') + ' ', ...messages)
  }

  success(notification: string, ...messages: string[]) {
    this.log(this.formatNotification(notification, 'green') + ' ', ...messages)
  }

  skipping(...messages: string[]) {
    this.log(this.formatNotification('Skipping', 'gray'), ...messages)
  }

  fetching(...messages: string[]) {
    this.log(this.formatNotification('Fetching...', 'yellow'), ...messages)
  }

  processing(...messages: string[]) {
    this.log(this.formatNotification('Processing...', 'yellow'), ...messages)
  }

  processed(...messages: string[]) {
    this.log(this.formatNotification('Processed', 'green'), ...messages)
  }

  assert(condition: boolean, ...messages: string[]): asserts condition {
    if (condition) return

    this.log(this.formatNotification('Error', 'red'), ...messages)

    this.log('\n')
    process.exit(1)
  }

  log(...messages: string[]) {
    if (!this.options.enabled) return
    console.log(...messages, ...(this.options.metadata ?? []))
  }

  formatNotification(
    notification: string,
    color: 'red' | 'green' | 'yellow' | 'blue' | 'gray',
  ) {
    const withPrefix = `[${this.options.prefix ?? ''}] ${chalk[color](
      notification,
    )}`

    return this.options.prefix ? withPrefix : chalk[color](notification)
  }

  configure(options: Partial<LoggerOptions>): ScriptLogger {
    const logger = new ScriptLogger({ ...this.options, ...options })
    return logger
  }

  prefix(prefix: string): ScriptLogger {
    return this.configure({ prefix })
  }

  addMetadata(...metadata: string[]): ScriptLogger {
    return this.configure({ metadata })
  }
}
