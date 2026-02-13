import type { Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
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
}

export function getTransferSizeChartData(
  records: AggregatedInteropTransferRecord[],
  interopProjects: Project<'interopConfig'>[],
): TransferSizeDataPoint[] | undefined {
  const data = new Map<string, TransferSizeDataPoint>()

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
    }

    const countUnder100 = current.countUnder100 + record.countUnder100
    const count100To1K = current.count100To1K + record.count100To1K
    const count1KTo10K = current.count1KTo10K + record.count1KTo10K
    const count10KTo100K = current.count10KTo100K + record.count10KTo100K
    const countOver100K = current.countOver100K + record.countOver100K

    const total =
      countUnder100 +
      count100To1K +
      count1KTo10K +
      count10KTo100K +
      countOver100K

    data.set(record.id, {
      name: current.name,
      iconUrl: current.iconUrl,
      countUnder100,
      percentageUnder100:
        total > 0 ? round((countUnder100 / total) * 100, 2) : 0,
      count100To1K,
      percentage100To1K: total > 0 ? round((count100To1K / total) * 100, 2) : 0,
      count1KTo10K,
      percentage1KTo10K: total > 0 ? round((count1KTo10K / total) * 100, 2) : 0,
      count10KTo100K,
      percentage10KTo100K:
        total > 0 ? round((count10KTo100K / total) * 100, 2) : 0,
      countOver100K,
      percentageOver100K:
        total > 0 ? round((countOver100K / total) * 100, 2) : 0,
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
    }))
}
