/** @deprecated Will be removed alongside old backend */
export class SimpleDate {
  private constructor(private date: Date) {}

  static today() {
    const date = new Date()
    clearUTCTime(date)
    return new SimpleDate(date)
  }

  static fromString(date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new TypeError('Date must be YYYY-MM-DD')
    }
    const [year, month, day] = date.split('-').map((x) => parseInt(x))
    const result = new Date()
    result.setUTCFullYear(year, month - 1, day)
    clearUTCTime(result)
    return new SimpleDate(result)
  }

  static fromUnixTimestamp(timestamp: number) {
    const result = new Date(timestamp * 1000)
    clearUTCTime(result)
    return new SimpleDate(result)
  }

  addDays(n: number) {
    const date = new Date(this.date)
    date.setUTCDate(date.getUTCDate() + n)
    return new SimpleDate(date)
  }

  equals(other: SimpleDate) {
    return this.date.getTime() === other.date.getTime()
  }

  isAfter(other: SimpleDate) {
    return this.date.getTime() > other.date.getTime()
  }

  isBefore(other: SimpleDate) {
    return this.date.getTime() < other.date.getTime()
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`
  }

  toDDMMYYYYString() {
    return `${this.day}-${this.month}-${this.year}`
  }

  private get year() {
    return this.date.getUTCFullYear().toString().padStart(4, '0')
  }

  private get month() {
    return (this.date.getUTCMonth() + 1).toString().padStart(2, '0')
  }

  private get day() {
    return this.date.getUTCDate().toString().padStart(2, '0')
  }

  toUnixTimestamp() {
    return Math.floor(this.date.getTime() / 1000)
  }
}

function clearUTCTime(date: Date) {
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)
}
