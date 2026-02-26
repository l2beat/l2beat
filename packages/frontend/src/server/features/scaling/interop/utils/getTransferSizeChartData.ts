import type { Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { assert, getInteropTransferValue } from '@l2beat/shared-pure'
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

type TransferSizeDataPointAccumulated = TransferSizeDataPoint & {
  totalValueUsd: number
  identifiedCount: number
}

export function getTransferSizeChartData(
  records: AggregatedInteropTransferRecord[],
  interopProjects: Project<'interopConfig'>[],
): TransferSizeDataPoint[] | undefined {
  const data = new Map<string, TransferSizeDataPointAccumulated>()

  if (records.length === 0) {
    return undefined
  }

  for (const record of records) {
    const project = interopProjects.find((p) => p.id === record.id)
    assert(project, `Project not found: ${record.id}`)
    const current = data.get(record.id) || {
      name: project.interopConfig.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      countUnder100: 0,
      count100To1K: 0,
      count1KTo10K: 0,
      count10KTo100K: 0,
      countOver100K: 0,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      averageTransferSizeUsd: undefined,
      totalValueUsd: 0,
      identifiedCount: 0,
    }

    const countUnder100 = current.countUnder100 + record.countUnder100
    const count100To1K = current.count100To1K + record.count100To1K
    const count1KTo10K = current.count1KTo10K + record.count1KTo10K
    const count10KTo100K = current.count10KTo100K + record.count10KTo100K
    const countOver100K = current.countOver100K + record.countOver100K
    const minTransferValueUsd =
      record.minTransferValueUsd !== undefined
        ? current.minTransferValueUsd !== undefined
          ? Math.min(current.minTransferValueUsd, record.minTransferValueUsd)
          : record.minTransferValueUsd
        : current.minTransferValueUsd
    const maxTransferValueUsd =
      record.maxTransferValueUsd !== undefined
        ? current.maxTransferValueUsd !== undefined
          ? Math.max(current.maxTransferValueUsd, record.maxTransferValueUsd)
          : record.maxTransferValueUsd
        : current.maxTransferValueUsd

    const totalValueUsd =
      current.totalValueUsd + (getInteropTransferValue(record) ?? 0)
    const identifiedCount = current.identifiedCount + record.identifiedCount

    const total =
      countUnder100 +
      count100To1K +
      count1KTo10K +
      count10KTo100K +
      countOver100K

    if (total === 0) continue

    data.set(record.id, {
      name: current.name,
      iconUrl: current.iconUrl,
      countUnder100,
      percentageUnder100: round((countUnder100 / total) * 100, 2),
      count100To1K,
      percentage100To1K: round((count100To1K / total) * 100, 2),
      count1KTo10K,
      percentage1KTo10K: round((count1KTo10K / total) * 100, 2),
      count10KTo100K,
      percentage10KTo100K: round((count10KTo100K / total) * 100, 2),
      countOver100K,
      percentageOver100K: round((countOver100K / total) * 100, 2),
      minTransferValueUsd,
      maxTransferValueUsd,
      averageTransferSizeUsd:
        identifiedCount > 0 ? totalValueUsd / identifiedCount : undefined,
      totalValueUsd,
      identifiedCount,
    })
  }

  return Array.from(data.values())
    .sort((a, b) => b.percentageUnder100 - a.percentageUnder100)
    .slice(0, 15)
    .map((value) => ({
      name: value.name,
      iconUrl: value.iconUrl,
      countUnder100: value.countUnder100,
      percentageUnder100: value.percentageUnder100,
      count100To1K: value.count100To1K,
      percentage100To1K: value.percentage100To1K,
      count1KTo10K: value.count1KTo10K,
      percentage1KTo10K: value.percentage1KTo10K,
      count10KTo100K: value.count10KTo100K,
      percentage10KTo100K: value.percentage10KTo100K,
      countOver100K: value.countOver100K,
      percentageOver100K: value.percentageOver100K,
      minTransferValueUsd: value.minTransferValueUsd,
      maxTransferValueUsd: value.maxTransferValueUsd,
      averageTransferSizeUsd: value.averageTransferSizeUsd,
    }))
}
