import type { Project } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'

export type TransferSizeChartData = Record<string, TransferSizeData>

type TransferSizeData = {
  name: string
  iconUrl: string
  countUnder100: number
  count100To1K: number
  count1KTo10K: number
  count10KTo100K: number
  countOver100K: number
}

export function getTransferSizeChartData(
  records: AggregatedInteropTransferRecord[],
  interopProjects: Project<'interop'>[],
): TransferSizeChartData | undefined {
  const data = new Map<string, TransferSizeData & { volume: number }>()

  if (records.length === 0) {
    return undefined
  }

  for (const record of records) {
    const project = interopProjects.find((p) => p.id === record.id)
    assert(project, `Project not found: ${record.id}`)
    const current = data.get(record.id) || {
      name: project.interop.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      countUnder100: 0,
      count100To1K: 0,
      count1KTo10K: 0,
      count10KTo100K: 0,
      countOver100K: 0,
      volume: 0,
    }
    data.set(record.id, {
      ...current,
      volume: current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      countUnder100: current.countUnder100 + record.countUnder100,
      count100To1K: current.count100To1K + record.count100To1K,
      count1KTo10K: current.count1KTo10K + record.count1KTo10K,
      count10KTo100K: current.count10KTo100K + record.count10KTo100K,
      countOver100K: current.countOver100K + record.countOver100K,
    })
  }

  return Object.fromEntries(
    Array.from(data.entries())
      .sort((a, b) => b[1].volume - a[1].volume)
      .slice(0, 15)
      .map(([key, value]) => [
        key,
        {
          name: value.name,
          iconUrl: value.iconUrl,
          countUnder100: value.countUnder100,
          count100To1K: value.count100To1K,
          count1KTo10K: value.count1KTo10K,
          count10KTo100K: value.count10KTo100K,
          countOver100K: value.countOver100K,
        },
      ]),
  )
}
