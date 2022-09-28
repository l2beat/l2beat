import { Layer2TransactionApi } from '@l2beat/config'
import {
  ActivityChartPoint,
  ApiActivity,
  ProjectId,
  UnixTime,
} from '@l2beat/types'

import { RpcTransactionCountRepository } from '../../peripherals/database/RpcTransactionCountRepository'
import { StarkexTransactionCountRepository } from '../../peripherals/database/StarkexTransactionCountRepository'
import { TransactionCountRepository } from '../../peripherals/database/TransactionCountRepository'

interface ProjectCounts {
  projectId: ProjectId
  counts: { timestamp: UnixTime; count: number }[]
}

interface Project {
  projectId: ProjectId
  transactionApi?: Layer2TransactionApi
}

export class ActivityController {
  constructor(
    private projects: Project[],
    private rpcRepository: RpcTransactionCountRepository,
    private starkexRepository: StarkexTransactionCountRepository,
  ) {}

  async getTransactionActivity(): Promise<ApiActivity> {
    const projectsCounts = await this.getProjectsCounts()

    return {
      combined: this.toCombinedActivity(projectsCounts),
      projects: this.toProjectsActivity(projectsCounts),
    }
  }

  private async getProjectsCounts(): Promise<ProjectCounts[]> {
    const projectPromises = this.projects
      .filter((p): p is Required<Project> => !!p.transactionApi)
      .map(async (p) => {
        const repository = this.getTransactionCountRepository(p.transactionApi)
        return {
          projectId: p.projectId,
          counts: await repository.getDailyTransactionCount(p.projectId),
        }
      })
    return Promise.all(projectPromises)
  }

  private getTransactionCountRepository(
    transactionApi: Layer2TransactionApi,
  ): TransactionCountRepository {
    switch (transactionApi.type) {
      case 'rpc':
        return this.rpcRepository
      case 'starkex':
        return this.starkexRepository
      default:
        throw new Error(
          `Programmer error: could not detect repository for transaction api type`,
        )
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
