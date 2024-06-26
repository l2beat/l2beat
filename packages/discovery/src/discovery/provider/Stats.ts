import { formatAsAsciiTable } from '@l2beat/shared-pure'

export interface ProviderStats {
  callCount: number
  getStorageCount: number
  getLogsCount: number
  getTransactionCount: number
  getDebugTraceCount: number
  getBytecodeCount: number
  getSourceCount: number
  getDeploymentCount: number
  getBlockCount: number
  getBlockNumberCount: number
}

export interface AllProviderStats {
  highLevelCounts: ProviderStats
  cacheCounts: ProviderStats
  lowLevelCounts: ProviderStats
}

export function getZeroStats(): ProviderStats {
  return {
    callCount: 0,
    getStorageCount: 0,
    getLogsCount: 0,
    getTransactionCount: 0,
    getDebugTraceCount: 0,
    getBytecodeCount: 0,
    getSourceCount: 0,
    getDeploymentCount: 0,
    getBlockCount: 0,
    getBlockNumberCount: 0,
  }
}

export function addStats(a: ProviderStats, b: ProviderStats): ProviderStats {
  const keys = Object.keys(a) as (keyof ProviderStats)[]
  const result = getZeroStats()
  for (const key of keys) {
    result[key] = a[key] + b[key]
  }

  return result
}

export function printProviderStats({
  highLevelCounts,
  cacheCounts,
  lowLevelCounts,
}: AllProviderStats): void {
  const keys = Object.keys(highLevelCounts) as (keyof ProviderStats)[]
  const headers = [
    'Operation',
    'High Level',
    'Caching',
    'Caching %',
    'Low Level',
    'Avg multicall size',
  ]
  const rows = keys.map((key) =>
    [
      key,
      highLevelCounts[key],
      cacheCounts[key],
      `${Math.floor(
        (cacheCounts[key] / Math.max(1, highLevelCounts[key])) * 100,
      )} %`,
      lowLevelCounts[key],
      (
        (highLevelCounts[key] - cacheCounts[key]) /
        Math.max(1, lowLevelCounts[key])
      ).toFixed(0),
    ].map((x) => x.toString()),
  )
  console.log(formatAsAsciiTable(headers, rows))
}
