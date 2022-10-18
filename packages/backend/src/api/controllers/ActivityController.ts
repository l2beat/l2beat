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
} from '../../core/transaction-count/TransactionCounter'

interface Layer2 {
  projectId: ProjectId
  counts: DailyTransactionCount[]
}
export class ActivityController {
  constructor(
    private readonly layer2Counters: TransactionCounter[],
    private readonly ethereumCounter: TransactionCounter,
  ) {}

  async getTransactionActivity(): Promise<ActivityApiResponse> {
    const [layer2s, ethereumCounts] = await Promise.all([
      this.getLayer2s(),
      this.ethereumCounter.getFullySyncedDailyCounts(),
    ])
    const tip = this.getTip(layer2s, ethereumCounts)
    const fullySyncedLayer2s = layer2s.map(({ counts, projectId }) => ({
      projectId,
      counts: this.limitCounts(counts, tip),
    }))
    const fullySyncedEthereumCounts = this.limitCounts(ethereumCounts, tip)

    return {
      combined: this.toCombinedActivity(fullySyncedLayer2s),
      projects: this.toProjectsActivity(fullySyncedLayer2s),
      ethereum: this.countsToChart(fullySyncedEthereumCounts),
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

  private async getLayer2s(): Promise<Layer2[]> {
    return Promise.all(
      this.layer2Counters.map(async (c) => ({
        projectId: c.projectId,
        counts: await c.getFullySyncedDailyCounts(),
      })),
    )
  }

  private getTip(layer2s: Layer2[], ethereumCounts: DailyTransactionCount[]) {
    const layer2Tip = layer2s.reduce<UnixTime>((minTip, { counts }) => {
      const counterTip = counts.at(-1)?.timestamp
      return counterTip?.lt(minTip) ? counterTip : minTip
    }, UnixTime.now())
    const ethereumTip = ethereumCounts.at(-1)?.timestamp
    const tip = ethereumTip?.lt(layer2Tip) ? ethereumTip : layer2Tip
    return tip
  }

  private toCombinedActivity(
    layer2s: Layer2[],
  ): ActivityApiResponse['combined'] {
    return this.formatChart(
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

  private toProjectsActivity(
    layer2s: Layer2[],
  ): ActivityApiResponse['projects'] {
    const projects: ActivityApiResponse['projects'] = {}
    for (const { projectId, counts } of layer2s) {
      projects[projectId.toString()] = this.countsToChart(counts)
    }
    return projects
  }

  private countsToChart(counts: DailyTransactionCount[]) {
    return this.formatChart(counts.map((c) => [c.timestamp, c.count]))
  }

  private formatChart(data: ActivityApiChartPoint[]): ActivityApiChart {
    return {
      types: ['timestamp', 'daily tx count'],
      data,
    }
  }

  private limitCounts(counts: DailyTransactionCount[], tip: UnixTime) {
    return counts.filter((count) => count.timestamp.lte(tip))
  }
}
