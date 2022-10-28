import {
  ActivityApiChart,
  ActivityApiChartPoint,
  ActivityApiResponse,
  json,
  ProjectId,
  UnixTime,
} from '@l2beat/types'

import {
  DailyTransactionCount,
  TransactionCounter,
} from '../../../core/transaction-count/TransactionCounter'
import { getTip } from './getTip'

interface Layer2Count {
  projectId: ProjectId
  counts: DailyTransactionCount[]
}

export class ActivityController {
  constructor(
    private readonly layer2Counters: TransactionCounter[],
    private readonly ethereumCounter: TransactionCounter,
  ) {}

  async getTransactionActivity(): Promise<ActivityApiResponse> {
    const [layer2sCounts, ethereumCounts] = await Promise.all([
      this.getLayer2sCounts(),
      this.ethereumCounter.getDailyCounts(),
    ])
    const tip = getTip(
      layer2sCounts.map((l2) => l2.counts).concat([ethereumCounts]),
    )
    const fullySyncedLayer2s = layer2sCounts.map(({ counts, projectId }) => ({
      projectId,
      counts: limitCounts(counts, tip),
    }))
    const fullySyncedEthereumCounts = limitCounts(ethereumCounts, tip)

    return {
      combined: toCombinedActivity(fullySyncedLayer2s),
      projects: toProjectsActivity(fullySyncedLayer2s),
      ethereum: countsToChart(fullySyncedEthereumCounts),
    }
  }

  async getStatus(): Promise<json> {
    const layer2s = await Promise.all(
      this.layer2Counters.map(async (c) => ({
        projectId: c.projectId.toString(),
        status: await c.getStatus(),
      })),
    )
    return layer2s.concat({
      projectId: ProjectId.ETHEREUM.toString(),
      status: await this.ethereumCounter.getStatus(),
    })
  }

  private async getLayer2sCounts(): Promise<Layer2Count[]> {
    return Promise.all(
      this.layer2Counters.map(async (c) => ({
        projectId: c.projectId,
        counts: await c.getDailyCounts(),
      })),
    )
  }
}

function toCombinedActivity(
  layer2s: Layer2Count[],
): ActivityApiResponse['combined'] {
  return formatChart(
    layer2s
      .map((l2) => l2.counts)
      .flat()
      .sort((a, b) => +a.timestamp - +b.timestamp)
      .reduce<ActivityApiChartPoint[]>((acc, { count, timestamp }) => {
        const current = acc.at(-1)
        if (!current?.[0].equals(timestamp)) {
          acc.push([timestamp, count])
        } else {
          current[1] = current[1] + count
        }
        return acc
      }, []),
  )
}

function toProjectsActivity(
  layer2s: Layer2Count[],
): ActivityApiResponse['projects'] {
  const projects: ActivityApiResponse['projects'] = {}
  for (const { projectId, counts } of layer2s) {
    projects[projectId.toString()] = countsToChart(counts)
  }
  return projects
}

function countsToChart(counts: DailyTransactionCount[]) {
  return formatChart(counts.map((c) => [c.timestamp, c.count]))
}

function formatChart(data: ActivityApiChartPoint[]): ActivityApiChart {
  return {
    types: ['timestamp', 'daily tx count'],
    data,
  }
}

function limitCounts(counts: DailyTransactionCount[], tip: UnixTime) {
  return counts.filter((count) => count.timestamp.lte(tip))
}
