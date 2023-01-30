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
  private readonly DEFAULT_LOG_INFO = {
    count: 0,
    isThrottling: false,
    throttleCount: 0,
  }

  private readonly recentLogs: Map<string, LogInfo>
  private readonly logger: Logger = new Logger({
    logLevel: LogLevel.INFO,
    format: 'pretty',
    service: LogThrottler.name,
  })

  constructor(private readonly options: LogThrottlerOptions) {
    this.recentLogs = new Map<string, LogInfo>()
    setInterval(() => this.clearCount(), options.thresholdTime)
  }

  add(logKey: string): void {
    let logInfo = this.recentLogs.get(logKey)

    if (!logInfo) {
      logInfo = this.DEFAULT_LOG_INFO
      this.recentLogs.set(logKey, logInfo)
    }

    this.incrementCount(logInfo)

    if (!logInfo.isThrottling && logInfo.count >= this.options.threshold) {
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
  }

  private clearCount(): void {
    this.recentLogs.forEach((value) => (value.count = 0))
  }
}
