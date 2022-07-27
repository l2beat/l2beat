import {
  ApiMain,
  ChartPoint,
  Project,
  ProjectId,
  UnixTime,
} from '@l2beat/common'

import { ProjectInfo } from '../../../model'
import { AggregateReportRecord } from '../../../peripherals/database/AggregateReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'

export function generateMain(
  aggregateReports: AggregateReportRecord[],
  tokenBreakdown: ReportRecord[],
  projects: ProjectInfo[],
) {
  const apiMain: ApiMain = {
    charts: {
      daily: {
        types: ['timestamp', 'usd', 'eth'],
        data: getProjectDailyChartData(aggregateReports, ProjectId.ALL),
      },
    },
    projects: {},
  }

  for (const p of projects) {
    const project: Project = {
      charts: {
        daily: {
          types: ['timestamp', 'usd', 'eth'],
          data: getProjectDailyChartData(aggregateReports, p.projectId),
        },
      },
      tokens: tokenBreakdown
        .filter((r) => r.projectId === p.projectId)
        .map((r) => ({ assetId: r.asset, tvl: asNumber(r.balanceUsd, 2) })),
    }
    apiMain.projects[p.name] = project
  }
  return apiMain
}

function getDailyTimestamps(min: UnixTime, max: UnixTime) {
  const timestamps: UnixTime[] = []
  for (let t = min; !t.gt(max); t = t.add(1, 'days')) {
    timestamps.push(t)
  }
  return timestamps
}

function insertAt<T>(arr: T[], i: number, el: T): T[] {
  return [...arr.slice(0, i), el, ...arr.slice(i + 1)]
}

function addMissingTimestamps(points: ChartPoint[]): ChartPoint[] {
  if (points.length === 0) return []
  const [min] = points[0]
  const [max] = points[points.length - 1]
  const daily = getDailyTimestamps(min, max)

  return daily.reduce((acc, timestamp, i) => {
    const [currTimestamp] = acc[i]
    if (currTimestamp.equals(timestamp)) {
      return acc
    }
    const [, prev1, prev2] = acc[i - 1]
    return insertAt(acc, i, [timestamp, prev1, prev2])
  }, points)
}

function getProjectDailyChartData(
  reports: AggregateReportRecord[],
  projectId: ProjectId,
): ChartPoint[] {
  const existing: ChartPoint[] = reports
    .filter((r) => r.projectId === projectId)
    .map((r) => [r.timestamp, asNumber(r.tvlUsd, 2), asNumber(r.tvlEth, 6)])
  return addMissingTimestamps(existing)
}
