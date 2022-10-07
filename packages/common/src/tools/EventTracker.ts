const ONE_HOUR = 1_000 * 60 * 60

interface Event<T extends string> {
  timestamp: number
  name: T
}

export class EventTracker<T extends string> {
  private events: Event<T>[] = []
  pruningIntervalId?: NodeJS.Timer

  constructor(private readonly historySize = ONE_HOUR) {
    this.enablePruning()
  }

  record(name: T) {
    this.events.push({ timestamp: Date.now(), name })
  }

  getStats() {
    this.pruneOldEvents()
    const now = Date.now()
    return {
      lastSecond: this.getSecondsAverage(now, 1),
      lastMinuteAverage: this.getSecondsAverage(now, 60),
      lastHourAverage: this.getSecondsAverage(now, 60 * 60),
    }
  }

  getEventsCount() {
    return this.events.length
  }

  private enablePruning() {
    const intervalId = setInterval(
      () => this.pruneOldEvents(),
      this.historySize,
    )
    // Let tests end without explicitly stopping the interval
    // Ref: https://stackoverflow.com/a/48192771
    intervalId.unref()
  }

  private getSecondsAverage(
    now: number,
    secondsBack: number,
  ): Record<T, number> {
    const beginning = now - secondsBack * 1_000
    const sums = this.events
      .filter(({ timestamp }) => timestamp > beginning)
      .reduce<Record<string, number>>(
        (acc, { name }) => ({ ...acc, [name]: (acc[name] || 0) + 1 }),
        {},
      )
    const averages = Object.entries(sums).reduce<Record<string, number>>(
      (acc, [name, count]) => ({
        ...acc,
        [name]: count / secondsBack,
      }),
      {},
    )
    return averages
  }

  private pruneOldEvents() {
    const beginning = Date.now() - this.historySize
    this.events = this.events.filter(({ timestamp }) => timestamp > beginning)
  }
}
