import { getErrorMessage } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { inspect } from 'util'

import { ILogger, LoggerOptions, LoggerParameters, LogLevel } from './ILogger'
import { LogThrottler } from './LogThrottler'

export class Logger implements ILogger {
  constructor(
    private readonly options: LoggerOptions,
    private readonly logThrottler?: LogThrottler,
  ) {}

  static SILENT = new Logger({ logLevel: LogLevel.NONE, format: 'pretty' })
  static DEBUG = new Logger({ logLevel: LogLevel.DEBUG, format: 'pretty' })

  getLogLevel(): LogLevel {
    return this.options.logLevel
  }

  configure(options: Partial<LoggerOptions>) {
    return new Logger({ ...this.options, ...options }, this.logThrottler)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  for(service: object | string) {
    const name =
      typeof service === 'string' ? service : service.constructor.name
    return this.configure({
      service: this.options.service ? `${this.options.service}.${name}` : name,
    })
  }

  error(error: unknown): void
  error(parameters: LoggerParameters, error: unknown): void
  error(...args: [unknown] | [LoggerParameters, unknown]): void {
    if (this.options.logLevel >= LogLevel.ERROR) {
      const [parameters, error] = args.length === 1 ? [{}, args[0]] : args

      const message = { ...parameters, error: getErrorMessage(error) }

      this.print('error', { message })
      this.options.reportError?.(
        new Error(this.formatErrorReport(parameters, message.error)),
      )
    }
  }

  warn(message: string, parameters?: LoggerParameters): void
  warn(parameters: LoggerParameters): void
  warn(message: string | LoggerParameters, parameters?: LoggerParameters) {
    if (this.options.logLevel >= LogLevel.WARN) {
      this.print('warn', combine(message, parameters))
    }
  }

  info(message: string, parameters?: LoggerParameters): void
  info(parameters: LoggerParameters): void
  info(message: string | LoggerParameters, parameters?: LoggerParameters) {
    if (this.options.logLevel >= LogLevel.INFO) {
      this.print('info', combine(message, parameters))
    }
  }

  debug(message: string, parameters?: LoggerParameters): void
  debug(parameters: LoggerParameters): void
  debug(message: string | LoggerParameters, parameters?: LoggerParameters) {
    if (this.options.logLevel >= LogLevel.DEBUG) {
      this.print('debug', combine(message, parameters))
    }
  }

  private formatErrorReport(parameter: LoggerParameters, errorStr: string) {
    const service = this.options.service ?? 'unknown service'
    const logMessage =
      parameter.message && typeof parameter.message === 'string'
        ? parameter.message
        : 'no message provided'

    return `[${service}]: ${logMessage} [${errorStr}]`
  }

  private print(level: string, parameters: LoggerParameters) {
    const logKey = `${this.options.service ?? ''} ${
      parameters.message?.toString() ?? ''
    }`.trim()

    this.logThrottler?.add(logKey)
    if (this.logThrottler?.isThrottling(logKey)) return

    switch (this.options.format) {
      case 'json':
        return this.printJson(level, parameters)
      case 'pretty':
        return this.printPretty(level, parameters)
    }
  }

  private printJson(level: string, parameters: LoggerParameters) {
    const time = new Date().toISOString()
    const data = {
      time,
      level,
      service: this.options.service,
      ...parameters,
    }
    const str = JSON.stringify(data)
    if (data.level === 'error') {
      console.error(str)
    } else {
      console.log(str)
    }
  }

  private printPretty(level: string, parameters: LoggerParameters) {
    const time = getPrettyTime()
    const levelOut = getPrettyLevel(level)
    const service = getPrettyService(this.options.service)
    let messageOut = ''
    if (typeof parameters.message === 'string') {
      messageOut = `${parameters.message}`
      delete parameters.message
    }
    const params = getPrettyParameters(parameters)
    const str = `${time} ${levelOut}${service} ${messageOut}${params}`

    if (parameters.level === 'error') {
      console.error(str)
    } else {
      console.log(str)
    }
  }
}

function combine(
  message: string | LoggerParameters,
  parameters?: LoggerParameters,
): LoggerParameters {
  if (typeof message === 'string') {
    return { message, ...parameters }
  } else {
    return { ...message, ...parameters }
  }
}

function getPrettyTime() {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  const s = now.getSeconds().toString().padStart(2, '0')
  const ms = now.getMilliseconds().toString().padStart(3, '0')
  return chalk.gray(`${h}:${m}:${s}.${ms}`)
}

function getPrettyLevel(level: string) {
  switch (level) {
    case 'error':
      return chalk.red(level.toUpperCase())
    case 'warn':
      return chalk.yellow(level.toUpperCase())
    case 'info':
      return chalk.blue(level.toUpperCase())
    case 'debug':
      return chalk.gray(level.toUpperCase())
  }
  return level.toUpperCase()
}

function getPrettyService(service: string | undefined) {
  if (service === undefined) {
    return ''
  }
  return ` [${chalk.magenta(service)}]`
}

function getPrettyParameters(parameters: LoggerParameters | undefined) {
  if (parameters === undefined) {
    return ''
  }
  const previous = inspect.styles
  const newStyles = { ...previous }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  ;(newStyles as any).name = 'magenta'
  newStyles.string = ''
  newStyles.number = ''
  newStyles.boolean = ''
  inspect.styles = newStyles
  const str = ` ${inspect(parameters, { colors: true, breakLength: Infinity })}`
  inspect.styles = previous
  if (str === ' {}') {
    return ''
  }
  return str
}
