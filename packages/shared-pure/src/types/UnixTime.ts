const YEAR_3000_TIMESTAMP = Math.floor(
  new Date('3000-01-01T00:00:00.000Z').getTime() / 1000,
)

// Note: This could've been a branded type, but then using it would be very cumbersome
// Because it's not branded it's less about safety and more about utilities for working with time
export type UnixTime = number
export type UnixTimePeriod = 'day' | 'hour' | 'minute' | 'six hours'

export function UnixTime(timestamp: number): UnixTime {
  if (!Number.isInteger(timestamp)) {
    throw new TypeError('timestamp must be an integer')
  }
  if (timestamp > YEAR_3000_TIMESTAMP) {
    throw new TypeError('timestamp too large!')
  }
  return timestamp
}

UnixTime.DAY = 86_400 as const
UnixTime.HOUR = 3_600 as const
UnixTime.MINUTE = 60 as const
UnixTime.SIX_HOURS = 21_600 as const

UnixTime.periodToSeconds = function periodToSeconds(
  period: UnixTimePeriod,
): number {
  switch (period) {
    case 'day':
      return UnixTime.DAY
    case 'hour':
      return UnixTime.HOUR
    case 'minute':
      return UnixTime.MINUTE
    case 'six hours':
      return UnixTime.SIX_HOURS
  }
}

UnixTime.now = function now(): UnixTime {
  return Math.floor(Date.now() / 1000)
}

UnixTime.fromDate = function fromDate(date: Date): UnixTime {
  return Math.floor(date.getTime() / 1000)
}

UnixTime.toStartOf = function toStartOf(
  timestamp: UnixTime,
  period: UnixTimePeriod,
): UnixTime {
  const modulus = UnixTime.periodToSeconds(period)
  return timestamp - (timestamp % modulus)
}

UnixTime.toEndOf = function toEndOf(
  timestamp: UnixTime,
  period: UnixTimePeriod,
): UnixTime {
  return UnixTime.isFull(timestamp, period)
    ? timestamp
    : UnixTime.toNext(timestamp, period)
}

UnixTime.toNext = function toNext(
  timestamp: UnixTime,
  period: UnixTimePeriod,
): UnixTime {
  const modulus = UnixTime.periodToSeconds(period)
  const remaining = modulus - (timestamp % modulus)
  return timestamp + remaining
}

UnixTime.isFull = function isFull(
  timestamp: UnixTime,
  period: UnixTimePeriod,
): boolean {
  const modulus = UnixTime.periodToSeconds(period)
  return !(timestamp % modulus)
}

UnixTime.inExclusiveRange = function inExclusiveRange(
  timestamp: UnixTime,
  from: UnixTime,
  to: UnixTime,
): boolean {
  return timestamp > from && timestamp < to
}

UnixTime.toDate = function toDate(timestamp: UnixTime): Date {
  return new Date(timestamp * 1000)
}

UnixTime.toYYYYMMDD = function toYYYYMMDD(timestamp: UnixTime): string {
  return UnixTime.toDate(timestamp).toISOString().slice(0, 10)
}

UnixTime.toYYYYMMDDHHMM = function toYYYYMMDDHHMM(timestamp: UnixTime): string {
  return UnixTime.toDate(timestamp).toISOString().slice(0, 16)
}
UnixTime.toDays = function toDays(timestamp: UnixTime): number {
  if (timestamp % UnixTime.DAY !== 0) {
    throw new Error('Timestamp must be a full day')
  }
  return timestamp / UnixTime.DAY
}
