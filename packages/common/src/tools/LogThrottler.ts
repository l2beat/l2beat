type LogInfo = {
  count: number
  throttleCount: number
  isThrottling: boolean
}

export class LogThrottler {
  private readonly recentLogs: Map<string, LogInfo>

  constructor(
    private readonly threshold: number,
    private readonly thresholdTimeInMs: number,
    private readonly throttleTimeInMs: number,
  ) {
    this.recentLogs = new Map<string, LogInfo>()
  }

  add(logKey: string) {
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

    if (logInfo.count >= this.threshold && !logInfo.isThrottling) {
      this.throttle(logKey, logInfo)
    }
  }

  isThrottling(logKey: string) {
    return this.recentLogs.get(logKey)?.isThrottling
  }

  private throttle(logKey: string, logInfo: LogInfo) {
    logInfo.isThrottling = true

    setTimeout(() => {
      if (logInfo.throttleCount != 0) {
        console.log(
          `[LOG THROTTLER] ${logKey} was logged ${
            logInfo.throttleCount
          } times during last ${this.throttleTimeInMs / 1000} seconds`,
        )
      }
      logInfo.isThrottling = false
      logInfo.throttleCount = 0
    }, this.throttleTimeInMs)
  }

  private incrementCount(logInfo: LogInfo) {
    if (logInfo.isThrottling) {
      logInfo.throttleCount += 1
      return
    }

    logInfo.count += 1

    setTimeout(() => this.decrementCount(logInfo), this.thresholdTimeInMs)
  }

  private decrementCount(logInfo: LogInfo) {
    logInfo.count -= 1
  }
}
