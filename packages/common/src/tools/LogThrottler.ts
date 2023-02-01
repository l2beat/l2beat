// eslint-disable-next-line import/no-cycle
import { Logger, LoggerOptions } from './Logger'

interface LogInfo {
  count: number
  throttleCount: number
  isThrottling: boolean
}

interface LogThrottlerOptions {
  readonly threshold: number
  readonly thresholdTimeInMs: number
  readonly throttleTimeInMs: number
}

export class LogThrottler {
  private readonly recentLogs: Map<string, LogInfo>
  private readonly logger: Logger

  constructor(
    private readonly options: LogThrottlerOptions,
    loggerConfig: LoggerOptions,
  ) {
    this.recentLogs = new Map<string, LogInfo>()
    this.logger = new Logger(loggerConfig).for(LogThrottler.name)

    setInterval(() => this.clearCount(), options.thresholdTimeInMs)
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
            this.options.thresholdTimeInMs / 1000
          } seconds`,
        )
      }
      logInfo.isThrottling = false
      logInfo.throttleCount = 0
    }, this.options.thresholdTimeInMs)
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
