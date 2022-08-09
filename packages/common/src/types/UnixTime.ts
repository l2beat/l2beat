const YEAR_3000_TIMESTAMP = Math.floor(
  new Date('3000-01-01T00:00:00.000Z').getTime() / 1000,
)

const SECONDS_PER_DAY = 86_400
const SECONDS_PER_HOUR = 3_600
const SECONDS_PER_MINUTE = 60

export class UnixTime {
  constructor(private timestamp: number) {
    if (!Number.isInteger(timestamp)) {
      throw new TypeError('timestamp must be an integer')
    } else if (timestamp > YEAR_3000_TIMESTAMP) {
      throw new TypeError('timestamp must represent time in seconds')
    }
  }

  static now() {
    return UnixTime.fromDate(new Date())
  }

  static fromDate(date: Date) {
    return new UnixTime(Math.floor(date.getTime() / 1000))
  }

  toStartOf(period: 'day' | 'hour' | 'minute') {
    const modulus =
      period === 'day'
        ? SECONDS_PER_DAY
        : period === 'hour'
        ? SECONDS_PER_HOUR
        : SECONDS_PER_MINUTE
    return new UnixTime(this.timestamp - (this.timestamp % modulus))
  }

  toNext(period: 'day' | 'hour' | 'minute') {
    const modulus =
      period === 'day'
        ? SECONDS_PER_DAY
        : period === 'hour'
        ? SECONDS_PER_HOUR
        : SECONDS_PER_MINUTE
    const remaining = modulus - (this.timestamp % modulus)
    return new UnixTime(this.timestamp + remaining)
  }

  isFull(period: 'day' | 'hour' | 'minute') {
    const modulus =
      period === 'day'
        ? SECONDS_PER_DAY
        : period === 'hour'
        ? SECONDS_PER_HOUR
        : SECONDS_PER_MINUTE
    const isFull = this.timestamp % modulus ? false : true
    return isFull
  }

  add(value: number, period: 'days' | 'hours' | 'minutes' | 'seconds') {
    if (!Number.isInteger(value)) {
      throw new TypeError('value must be an integer')
    }
    const unit =
      period === 'days'
        ? SECONDS_PER_DAY
        : period === 'hours'
        ? SECONDS_PER_HOUR
        : period === 'minutes'
        ? SECONDS_PER_MINUTE
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
}
