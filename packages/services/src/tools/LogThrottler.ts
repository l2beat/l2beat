import { ILogger } from './ILogger'

interface LogInfo {
  count: number
  throttleCount: number
  isThrottling: boolean
}

export interface LogThrottlerOptions {
  readonly threshold: number
  readonly thresholdTimeInMs: number
  readonly throttleTimeInMs: number
}
/**
 * @summary Aim of this class is to reduce log output by throttling.
 *
 * @description It allows to throttle given log for throttleTimeInMs if it was called threshold times in throttleTimeInMs
 * by storing count of how much time it was called in recentLogs by logKey.
 */
export class LogThrottler {
  private readonly recentLogs: Map<string, LogInfo>

  constructor(
    private readonly options: LogThrottlerOptions,
    private readonly logger: ILogger,
  ) {
    this.recentLogs = new Map<string, LogInfo>()
    this.logger.for(LogThrottler.name)
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

  isThrottling(logKey: string): boolean {
    return !!this.recentLogs.get(logKey)?.isThrottling
  }

  private throttle(logKey: string, logInfo: LogInfo): void {
    logInfo.isThrottling = true

    setTimeout(() => {
      if (logInfo.throttleCount !== 0) {
        this.logger.info(
          `"${logKey}" was logged ${logInfo.throttleCount} times during last ${
            this.options.throttleTimeInMs / 1000
          } seconds`,
        )
      }
      logInfo.isThrottling = false
      logInfo.throttleCount = 0
    }, this.options.throttleTimeInMs)
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
