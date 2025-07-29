import type { Logger } from '@l2beat/backend-tools'
import { formatSI } from '@l2beat/shared'
import { assert, formatAsAsciiTable } from '@l2beat/shared-pure'

export const ProviderMeasurement = {
  CALL: 0,
  GET_STORAGE: 1,
  GET_LOGS: 2,
  GET_TRANSACTION: 3,
  GET_DEBUG_TRACE: 4,
  GET_BYTECODE: 5,
  GET_SOURCE: 6,
  GET_DEPLOYMENT: 7,
  GET_BLOCK: 8,
  GET_BLOCKNUMBER: 9,
  GET_BLOCK_NUMBER_AT_OR_BEFORE: 10,
} as const

export const ProviderMeasurementCount = Object.keys(ProviderMeasurement).length

interface ProviderMark {
  count: number
  durations: number[]
}

export class ProviderStats {
  private measurements: ProviderMark[] = Array.from(
    { length: ProviderMeasurementCount },
    () =>
      ({
        count: 0,
        durations: [],
      }) satisfies ProviderMark,
  )

  mark(key: number, durations: number, count = 1): void {
    assert(key >= 0 && key < this.measurements.length, 'key out of bounds')
    assert(
      this.measurements[key] !== undefined,
      'entry should not be undefined',
    )
    this.measurements[key].count += count
    const partDuration = durations / count
    for (let i = 0; i < count; i++) {
      this.measurements[key].durations.push(partDuration)
    }
  }

  get(key: number): ProviderMark {
    assert(key >= 0 && key < this.measurements.length, 'key out of bounds')
    assert(
      this.measurements[key] !== undefined,
      'entry should not be undefined',
    )
    return this.measurements[key]
  }

  static add(a: ProviderStats, b: ProviderStats): ProviderStats {
    const result = new ProviderStats()
    for (let i = 0; i < ProviderMeasurementCount; i++) {
      const one = a.get(i)
      const two = b.get(i)
      result.measurements[i] = {
        count: one.count + two.count,
        durations: [...one.durations, ...two.durations],
      }
    }

    return result
  }
}

export interface AllProviderStats {
  highLevelMeasurements: ProviderStats
  cacheMeasurements: ProviderStats
  lowLevelMeasurements: ProviderStats
}

export function printProviderStats(
  logger: Logger,
  {
    highLevelMeasurements,
    cacheMeasurements,
    lowLevelMeasurements,
  }: AllProviderStats,
): void {
  const headers = [
    'Operation',
    'High Level',
    '<- Duration',
    'Caching',
    'Caching %',
    '<- Duration',
    'Low Level',
    '<- Duration',
    'Avg multicall size',
  ]

  const rows = []
  const keys = Object.keys(ProviderMeasurement)
  for (let key = 0; key < ProviderMeasurementCount; key++) {
    const highLevelEntry = highLevelMeasurements.get(key)
    const cacheEntry = cacheMeasurements.get(key)
    const lowLevelEntry = lowLevelMeasurements.get(key)

    rows.push(
      [
        keys[key] ?? '',
        highLevelEntry.count,
        formatDurations(highLevelEntry.durations),
        cacheEntry.count,
        `${Math.floor((cacheEntry.count / Math.max(1, highLevelEntry.count)) * 100)} %`,
        formatDurations(cacheEntry.durations),
        lowLevelEntry.count,
        formatDurations(lowLevelEntry.durations),
        (
          (highLevelEntry.count - cacheEntry.count) /
          Math.max(1, lowLevelEntry.count)
        ).toFixed(0),
      ].map((x) => x.toString()),
    )
  }

  logger.info(formatAsAsciiTable(headers, rows))
}

function formatDurations(durations: number[]): string {
  if (durations.length === 0) {
    return ''
  }

  const sum = durations.reduce((acc, v) => acc + v)
  const avg = sum / durations.length
  const variance =
    durations.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) /
    durations.length
  const stdDev = Math.sqrt(variance)

  return `${formatSI(avg / 1000, 's')} ± ${formatSI(stdDev / 1000, 's')}`
}
