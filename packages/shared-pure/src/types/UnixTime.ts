const YEAR_3000_TIMESTAMP = Math.floor(
  new Date('3000-01-01T00:00:00.000Z').getTime() / 1000,
)

export class UnixTime {
  constructor(private readonly timestamp: number) {
    if (!Number.isInteger(timestamp)) {
      throw new TypeError('timestamp must be an integer')
    } else if (timestamp > YEAR_3000_TIMESTAMP) {
      throw new TypeError('timestamp must represent time in seconds')
    }
  }

  static DAY = 86_400 as const

  static HOUR = 3_600 as const

  static MINUTE = 60 as const

  static SIX_HOURS = 21_600 as const

  /**
   * Static instance for test purposes, in most cases indicates that the timestamp is not important in this test case.
   */
  static ZERO = new UnixTime(0)

  static now() {
    return UnixTime.fromDate(new Date())
  }

  static fromDate(date: Date) {
    return new UnixTime(Math.floor(date.getTime() / 1000))
  }

  static fromDays(days: number) {
    return new UnixTime(days * UnixTime.DAY)
  }

  static min(a: UnixTime, b: UnixTime) {
    return a.lt(b) ? a : b
  }

  static max(a: UnixTime, b: UnixTime) {
    return a.gt(b) ? a : b
  }

  toStartOf(period: 'day' | 'hour' | 'minute' | 'six hours') {
    const modulus =
      period === 'day'
        ? UnixTime.DAY
        : period === 'hour'
          ? UnixTime.HOUR
          : period === 'six hours'
            ? UnixTime.SIX_HOURS
            : UnixTime.MINUTE
    return new UnixTime(this.timestamp - (this.timestamp % modulus))
  }

  toEndOf(period: 'day' | 'hour' | 'minute' | 'six hours') {
    return this.isFull(period) ? this : this.toNext(period)
  }

  toNext(period: 'day' | 'hour' | 'minute' | 'six hours') {
    const modulus =
      period === 'day'
        ? UnixTime.DAY
        : period === 'hour'
          ? UnixTime.HOUR
          : period === 'six hours'
            ? UnixTime.SIX_HOURS
            : UnixTime.MINUTE
    const remaining = modulus - (this.timestamp % modulus)
    return new UnixTime(this.timestamp + remaining)
  }

  isFull(period: 'day' | 'hour' | 'minute' | 'six hours') {
    const modulus =
      period === 'day'
        ? UnixTime.DAY
        : period === 'hour'
          ? UnixTime.HOUR
          : period === 'minute'
            ? UnixTime.MINUTE
            : UnixTime.SIX_HOURS
    const isFull = this.timestamp % modulus ? false : true
    return isFull
  }

  add(value: number, period: 'days' | 'hours' | 'minutes' | 'seconds') {
    if (!Number.isInteger(value)) {
      throw new TypeError('value must be an integer')
    }
    const unit =
      period === 'days'
        ? UnixTime.DAY
        : period === 'hours'
          ? UnixTime.HOUR
          : period === 'minutes'
            ? UnixTime.MINUTE
            : 1
    return new UnixTime(this.timestamp + value * unit)
  }

  equals(other: UnixTime) {
    return this.timestamp === other.timestamp
  }

  lt(other: UnixTime) {
    return this.timestamp < other.timestamp
  }

  lte(other: UnixTime) {
    return this.timestamp <= other.timestamp
  }

  gt(other: UnixTime) {
    return this.timestamp > other.timestamp
  }

  gte(other: UnixTime) {
    return this.timestamp >= other.timestamp
  }

  inExclusiveRange(from: UnixTime, to: UnixTime) {
    return this.gt(from) && this.lt(to)
  }

  inInclusiveRange(from: UnixTime, to: UnixTime) {
    return this.gte(from) && this.lte(to)
  }

  toNumber() {
    return this.timestamp
  }

  toDate() {
    return new Date(this.timestamp * 1000)
  }

  toString() {
    return this.timestamp.toString()
  }

  toJSON() {
    return this.timestamp
  }

  toYYYYMMDD() {
    return this.toDate().toISOString().slice(0, 10)
  }

  toDays() {
    if (this.timestamp % UnixTime.DAY !== 0) {
      throw new Error('Timestamp must be a full day')
    }

    return this.timestamp / UnixTime.DAY
  }

  static isSafeToCast(timestamp: number): boolean {
    try {
      new UnixTime(timestamp)
      return true
    } catch {
      return false
    }
  }
}
