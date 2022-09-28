import { ActivityChartPoint, ApiActivity } from '@l2beat/types'

import {
  ProjectCounts,
  TransactionCounter,
} from '../../core/transaction-count/TransactionCounter'

export class ActivityController {
  constructor(private transactionCounters: TransactionCounter[]) {}

  async getTransactionActivity(): Promise<ApiActivity> {
    const projectsCounts = await Promise.all(
      this.transactionCounters.map((c) => c.getDailyTransactionCounts()),
    )

    return {
      combined: this.toCombinedActivity(projectsCounts),
      projects: this.toProjectsActivity(projectsCounts),
    }
  }

  private toCombinedActivity(
    projectsCounts: ProjectCounts[],
  ): ApiActivity['combined'] {
    return {
      types: ['timestamp', 'daily tx count'],
      data: projectsCounts
        .map((p) => p.counts)
        .flat()
        .sort((a, b) => +a.timestamp - +b.timestamp)
        .reduce<ActivityChartPoint[]>((acc, { count, timestamp }) => {
          const current = acc.at(-1)
          if (!current?.[0].equals(timestamp)) {
            acc.push([timestamp, count])
          } else {
            current[1] = current[1] + count
          }
          return acc
        }, []),
    }
  }

  private toProjectsActivity(
    projectActivities: ProjectCounts[],
  ): ApiActivity['projects'] {
    const projects: ApiActivity['projects'] = {}
    for (const { projectId, counts } of projectActivities) {
      projects[projectId.toString()] = {
        data: counts.map((c) => [c.timestamp, c.count]),
        types: ['timestamp', 'daily tx count'],
      }
    }
    return projects
  }
}
