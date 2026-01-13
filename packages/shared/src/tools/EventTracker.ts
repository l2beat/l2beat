const ONE_HOUR = 1_000 * 60 * 60

interface Event<T extends string> {
  timestamp: number
  name: T
}

export class EventTracker<T extends string> {
  private events: Event<T>[] = []

  constructor(private readonly historySize = ONE_HOUR) {
    this.enablePruning()
  }

  record(name: T) {
    this.events.push({ timestamp: Date.now(), name })
  }

  getStatus() {
    this.pruneOldEvents()
    const now = Date.now()
    return {
      lastSecond: this.getSecondsAverages(now, 1),
      lastFiveSeconds: this.getSecondsTotals(now, 5),
      lastMinuteAverage: this.getSecondsAverages(now, 60),
      lastHourAverage: this.getSecondsAverages(now, 60 * 60),
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

  private getSecondsAverages(
    now: number,
    secondsBack: number,
  ): Record<T, number> {
    const totals = this.getSecondsTotals(now, secondsBack)
    const totalsEntries: [string, number][] = Object.entries(totals)
    const averages = totalsEntries.reduce<Record<string, number>>(
      (acc, [name, total]) => {
        acc[name] = total / secondsBack
        return acc
      },
      {},
    )
    return averages
  }

  private getSecondsTotals(
    now: number,
    secondsBack: number,
  ): Record<T, number> {
    const beginning = now - secondsBack * 1_000
    const totals = this.events
      .filter(({ timestamp }) => timestamp > beginning)
      .reduce<Record<string, number>>((acc, { name }) => {
        acc[name] = (acc[name] || 0) + 1
        return acc
      }, {})
    return totals
  }

  private pruneOldEvents() {
    const beginning = Date.now() - this.historySize
    this.events = this.events.filter(({ timestamp }) => timestamp > beginning)
  }
}
