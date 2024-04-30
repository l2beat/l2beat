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

  static DAY = 86_400

  static HOUR = 3_600

  static MINUTE = 60

  static SIX_HOURS = 6 * this.HOUR

  static now(): UnixTime {
    return UnixTime.fromDate(new Date())
  }

  static fromDate(date: Date): UnixTime {
    return new UnixTime(Math.floor(date.getTime() / 1000))
  }

  static fromDays(days: number): UnixTime {
    return new UnixTime(days * UnixTime.DAY)
  }

  toStartOf(period: 'day' | 'hour' | 'minute'): UnixTime {
    const modulus =
      period === 'day'
        ? UnixTime.DAY
        : period === 'hour'
          ? UnixTime.HOUR
          : UnixTime.MINUTE
    return new UnixTime(this.timestamp - (this.timestamp % modulus))
  }

  toNext(period: 'day' | 'hour' | 'minute'): UnixTime {
    const modulus =
      period === 'day'
        ? UnixTime.DAY
        : period === 'hour'
          ? UnixTime.HOUR
          : UnixTime.MINUTE
    const remaining = modulus - (this.timestamp % modulus)
    return new UnixTime(this.timestamp + remaining)
  }

  isFull(period: 'day' | 'hour' | 'minute' | 'six hours'): boolean {
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

  add(
    value: number,
    period: 'days' | 'hours' | 'minutes' | 'seconds',
  ): UnixTime {
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

  equals(other: UnixTime): boolean {
    return this.timestamp === other.timestamp
  }

  lt(other: UnixTime): boolean {
    return this.timestamp < other.timestamp
  }

  lte(other: UnixTime): boolean {
    return this.timestamp <= other.timestamp
  }

  gt(other: UnixTime): boolean {
    return this.timestamp > other.timestamp
  }

  gte(other: UnixTime): boolean {
    return this.timestamp >= other.timestamp
  }

  toNumber(): number {
    return this.timestamp
  }

  toDate(): Date {
    return new Date(this.timestamp * 1000)
  }

  toString(): string {
    return this.timestamp.toString()
  }

  toJSON(): number {
    return this.timestamp
  }

  toYYYYMMDD(): string {
    return this.toDate().toISOString().slice(0, 10)
  }

  toDays(): number {
    if (this.timestamp % UnixTime.DAY !== 0) {
      throw new Error('Timestamp must be a full day')
    }

    return this.timestamp / UnixTime.DAY
  }

  static isSafeToCast(timestamp: number): boolean {
    try {
      new UnixTime(timestamp)
      return true
    } catch (e) {
      return false
    }
  }
}
