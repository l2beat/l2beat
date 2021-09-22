import chalk from 'chalk'

export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LoggerOptions {
  logLevel: LogLevel
  name?: string
  format: 'pretty' | 'plain'
}

export class Logger {
  constructor(private options: LoggerOptions) {}

  static SILENT = new Logger({ logLevel: LogLevel.NONE, format: 'pretty' })

  configure(options: Partial<LoggerOptions>) {
    return new Logger({ ...this.options, ...options })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  for(object: {}) {
    return this.configure({ name: object.constructor.name })
  }

  error(error: unknown) {
    if (this.options.logLevel >= LogLevel.ERROR) {
      const message = getErrorMessage(error)
      this.print(
        this.color('red', 'ERROR'),
        this.color('red', message),
        'error'
      )
    }
  }

  info(message: string) {
    if (this.options.logLevel >= LogLevel.INFO) {
      this.print(this.color('blue', 'INFO'), message)
    }
  }

  debug(message: string) {
    if (this.options.logLevel >= LogLevel.DEBUG) {
      this.print(this.color('yellow', 'DEBUG'), message)
    }
  }

  private print(level: string, message: string, error?: 'error') {
    const time = this.options.format === 'pretty' ? `${getTime()} ` : ''
    const text = `${time}${level} ${this.formatMessage(message)}`
    if (error) {
      console.error(text)
    } else {
      console.log(text)
    }
  }

  private formatMessage(message: string) {
    if (this.options.name) {
      const name = this.color('magenta', this.options.name)
      return `[${name}] ${message}`
    } else {
      return message
    }
  }

  private color(color: string, text: string) {
    if (this.options.format === 'plain') {
      return text
    }
    switch (color) {
      case 'blue':
        return chalk.blue(text)
      case 'magenta':
        return chalk.magenta(text)
      case 'yellow':
        return chalk.yellow(text)
      case 'red':
        return chalk.red(text)
    }
    return text
  }
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error
  } else if (error instanceof Error) {
    return error.message
  } else {
    return '' + error
  }
}

function getTime() {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  const s = now.getSeconds().toString().padStart(2, '0')
  const ms = now.getMilliseconds().toString().padStart(3, '0')
  return chalk.gray(`${h}:${m}:${s}.${ms}`)
}
