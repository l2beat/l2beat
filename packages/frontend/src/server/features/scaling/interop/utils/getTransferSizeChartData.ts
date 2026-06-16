import type { Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import {
  assert,
  getInteropTransferValue,
  type InteropBridgeType,
} from '@l2beat/shared-pure'
import round from 'lodash/round'
import { manifest } from '~/utils/Manifest'

export type TransferSizeDataPoint = {
  name: string
  iconUrl: string
  countUnder100: number
  percentageUnder100: number
  count100To1K: number
  percentage100To1K: number
  count1KTo10K: number
  percentage1KTo10K: number
  count10KTo100K: number
  percentage10KTo100K: number
  countOver100K: number
  percentageOver100K: number
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  averageTransferSizeUsd: number | undefined
}

interface TransferSizeAccumulator {
  countUnder100: number
  count100To1K: number
  count1KTo10K: number
  count10KTo100K: number
  countOver100K: number
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  totalValueUsd: number
  identifiedCount: number
}

function createTransferSizeAccumulator(): TransferSizeAccumulator {
  return {
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    totalValueUsd: 0,
    identifiedCount: 0,
  }
}

function addRecord(
  acc: TransferSizeAccumulator,
  record: AggregatedInteropTransferRecord,
): void {
  acc.countUnder100 += record.countUnder100
  acc.count100To1K += record.count100To1K
  acc.count1KTo10K += record.count1KTo10K
  acc.count10KTo100K += record.count10KTo100K
  acc.countOver100K += record.countOver100K
  if (record.minTransferValueUsd !== undefined) {
    acc.minTransferValueUsd =
      acc.minTransferValueUsd !== undefined
        ? Math.min(acc.minTransferValueUsd, record.minTransferValueUsd)
        : record.minTransferValueUsd
  }
  if (record.maxTransferValueUsd !== undefined) {
    acc.maxTransferValueUsd =
      acc.maxTransferValueUsd !== undefined
        ? Math.max(acc.maxTransferValueUsd, record.maxTransferValueUsd)
        : record.maxTransferValueUsd
  }
  acc.totalValueUsd += getInteropTransferValue(record) ?? 0
  acc.identifiedCount += record.identifiedCount
}

function finalize(
  acc: TransferSizeAccumulator,
): Omit<TransferSizeDataPoint, 'name' | 'iconUrl'> | undefined {
  const total =
    acc.countUnder100 +
    acc.count100To1K +
    acc.count1KTo10K +
    acc.count10KTo100K +
    acc.countOver100K
  if (total === 0) return undefined

  return {
    countUnder100: acc.countUnder100,
    percentageUnder100: round((acc.countUnder100 / total) * 100, 2),
    count100To1K: acc.count100To1K,
    percentage100To1K: round((acc.count100To1K / total) * 100, 2),
    count1KTo10K: acc.count1KTo10K,
    percentage1KTo10K: round((acc.count1KTo10K / total) * 100, 2),
    count10KTo100K: acc.count10KTo100K,
    percentage10KTo100K: round((acc.count10KTo100K / total) * 100, 2),
    countOver100K: acc.countOver100K,
    percentageOver100K: round((acc.countOver100K / total) * 100, 2),
    minTransferValueUsd: acc.minTransferValueUsd,
    maxTransferValueUsd: acc.maxTransferValueUsd,
    averageTransferSizeUsd:
      acc.identifiedCount > 0
        ? acc.totalValueUsd / acc.identifiedCount
        : undefined,
  }
}

export function aggregateTransferSize(
  records: AggregatedInteropTransferRecord[],
): TransferSizeDataPoint | undefined {
  if (records.length === 0) return undefined

  const acc = createTransferSizeAccumulator()
  for (const record of records) {
    addRecord(acc, record)
  }
  const point = finalize(acc)
  return point ? { name: '', iconUrl: '', ...point } : undefined
}

export type TransferTypeDataPoint = Partial<Record<InteropBridgeType, number>>
export function aggregateTransferType(
  records: AggregatedInteropTransferRecord[],
): TransferTypeDataPoint | undefined {
  if (records.length === 0) return undefined

  const byType: TransferTypeDataPoint = {}
  let total = 0
  for (const record of records) {
    const value = getInteropTransferValue(record) ?? 0
    byType[record.bridgeType] = (byType[record.bridgeType] ?? 0) + value
    total += value
  }

  if (total === 0) return undefined
  return byType
}

export function getTransferSizeChartData(
  records: AggregatedInteropTransferRecord[],
  interopProjects: Project<'interopConfig'>[],
): TransferSizeDataPoint[] | undefined {
  if (records.length === 0) {
    return undefined
  }

  const byProject = new Map<
    string,
    { name: string; iconUrl: string; acc: TransferSizeAccumulator }
  >()

  for (const record of records) {
    let entry = byProject.get(record.id)
    if (!entry) {
      const project = interopProjects.find((p) => p.id === record.id)
      assert(project, `Project not found: ${record.id}`)
      entry = {
        name: project.interopConfig.name ?? project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        acc: createTransferSizeAccumulator(),
      }
      byProject.set(record.id, entry)
    }
    addRecord(entry.acc, record)
  }

  return Array.from(byProject.values())
    .flatMap(({ name, iconUrl, acc }) => {
      const point = finalize(acc)
      return point
        ? [{ name, iconUrl, ...point, totalValueUsd: acc.totalValueUsd }]
        : []
    })
    .sort((a, b) => b.totalValueUsd - a.totalValueUsd)
    .slice(0, 15)
    .sort((a, b) => b.percentageUnder100 - a.percentageUnder100)
    .map(({ totalValueUsd: _totalValueUsd, ...point }) => point)
}
