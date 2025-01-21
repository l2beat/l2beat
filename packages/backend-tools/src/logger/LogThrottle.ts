import type { LogLevel } from './LogLevel'

export interface Printer {
  print(
    logLevel: LogLevel,
    service: string | undefined,
    message: string | undefined,
    parameters: object,
  ): void
}

export interface LogThrottleOptions {
  readonly callsUntilThrottle: number
  readonly clearIntervalMs: number
  readonly throttleTimeMs: number
}

export class LogThrottle {
  constructor(
    private readonly printer: Printer,
    private readonly options: LogThrottleOptions,
  ) {}

  private callCount: Record<string, number> = {}
  private throttleCount: Record<string, number> = {}
  private started = false

  throttle(
    logLevel: LogLevel,
    service: string | undefined,
    message: string | undefined,
  ): boolean {
    this.start()

    const key = `${logLevel}:${service ?? ''}:${message ?? ''}`
    let isThrottling = key in this.throttleCount

    if (!isThrottling) {
      const count = (this.callCount[key] ?? 0) + 1
      this.callCount[key] = count

      if (count > this.options.callsUntilThrottle) {
        delete this.callCount[key]

        isThrottling = true
        this.waitAndClear(key, logLevel, service, message)
      }
    }

    if (isThrottling) {
      this.throttleCount[key] = (this.throttleCount[key] ?? 0) + 1
    }

    return isThrottling
  }

  private waitAndClear(
    key: string,
    logLevel: LogLevel,
    service: string | undefined,
    message: string | undefined,
  ): void {
    setTimeout(() => {
      const messageCount = this.throttleCount[key] ?? 0
      delete this.throttleCount[key]
      this.printer.print(
        logLevel,
        service,
        `Throttled ${JSON.stringify(message ?? '')}`,
        {
          messageCount,
          throttleTimeMs: this.options.throttleTimeMs,
        },
      )
    }, this.options.throttleTimeMs)
  }

  private start(): void {
    if (this.started) {
      return
    }

    this.started = true
    setInterval(() => {
      this.callCount = {}
    }, this.options.clearIntervalMs)
  }
}
