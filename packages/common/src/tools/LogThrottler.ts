import { Logger, LogLevel } from './Logger'

interface LogInfo {
  count: number
  throttleCount: number
  isThrottling: boolean
}

export interface LogThrottlerOptions {
  threshold: number
  thresholdTime: number
  throttleTime: number
}

export class LogThrottler {
  private readonly recentLogs: Map<string, LogInfo>
  private logger: Logger = new Logger({
    logLevel: LogLevel.INFO,
    format: 'pretty',
    service: LogThrottler.name,
  })

  constructor(private readonly options: LogThrottlerOptions) {
    this.recentLogs = new Map<string, LogInfo>()
  }

  add(logKey: string): void {
    let logInfo = this.recentLogs.get(logKey)

    if (!logInfo) {
      logInfo = {
        count: 0,
        isThrottling: false,
        throttleCount: 0,
      }
      this.recentLogs.set(logKey, logInfo)
    }

    this.incrementCount(logInfo)

    if (logInfo.count >= this.options.threshold && !logInfo.isThrottling) {
      this.throttle(logKey, logInfo)
    }
  }

  isThrottling(logKey: string): boolean | undefined {
    return this.recentLogs.get(logKey)?.isThrottling
  }

  private throttle(logKey: string, logInfo: LogInfo): void {
    logInfo.isThrottling = true

    setTimeout(() => {
      if (logInfo.throttleCount !== 0) {
        this.logger.info(
          `"${logKey}" was logged ${logInfo.throttleCount} times during last ${
            this.options.throttleTime / 1000
          } seconds`,
        )
      }
      logInfo.isThrottling = false
      logInfo.throttleCount = 0
    }, this.options.throttleTime)
  }

  private incrementCount(logInfo: LogInfo): void {
    if (logInfo.isThrottling) {
      logInfo.throttleCount += 1
      return
    }

    logInfo.count += 1

    setTimeout(() => this.decrementCount(logInfo), this.options.thresholdTime)
  }

  private decrementCount(logInfo: LogInfo): void {
    logInfo.count -= 1
  }
}
