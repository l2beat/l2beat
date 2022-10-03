import {
  ActivityApiChart,
  ActivityApiChartPoint,
  ActivityApiResponse,
  json,
  ProjectId,
} from '@l2beat/types'

import {
  DailyTransactionCount,
  TransactionCounter,
} from '../../core/transaction-count/TransactionCounter'

interface Layer2Counts {
  projectId: ProjectId
  counts: DailyTransactionCount[]
}
export class ActivityController {
  constructor(
    private layer2Counters: TransactionCounter[],
    private ethereumCounter: TransactionCounter,
  ) {}

  async getTransactionActivity(): Promise<ActivityApiResponse> {
    const [layer2Counts, ethereumCounts] = await Promise.all([
      this.getLayer2Counts(),
      this.ethereumCounter.getDailyTransactionCounts(),
    ])

    return {
      combined: this.toCombinedActivity(layer2Counts),
      projects: this.toProjectsActivity(layer2Counts),
      ethereum: this.countsToChart(ethereumCounts),
    }
  }

  private async getLayer2Counts(): Promise<Layer2Counts[]> {
    return Promise.all(
      this.layer2Counters.map(async (c) => ({
        projectId: c.projectId,
        counts: await c.getDailyTransactionCounts(),
      })),
    )
  }

  async getStatus(): Promise<json> {
    return Promise.all([
      ...this.layer2Counters.map(async (c) => ({
        projectId: c.projectId.toString(),
        status: await c.getStatus(),
      })),
      {
        projectId: ProjectId.ETHEREUM.toString(),
        status: await this.ethereumCounter.getStatus(),
      },
    ])
  }

  private toCombinedActivity(
    layer2Counts: Layer2Counts[],
  ): ActivityApiResponse['combined'] {
    return this.formatChart(
      layer2Counts
        .map((p) => p.counts)
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
    layer2Counts: Layer2Counts[],
  ): ActivityApiResponse['projects'] {
    const projects: ActivityApiResponse['projects'] = {}
    for (const { projectId, counts } of layer2Counts) {
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
}
