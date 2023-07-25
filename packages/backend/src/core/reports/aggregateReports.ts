import { ProjectId, UnixTime, ValueType } from '@l2beat/shared-pure'

import { AggregatedReportRecord } from '../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { ReportProject } from './ReportProject'

export interface Category {
  projectId: ProjectId
  check: (project: ReportProject) => boolean
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    projectId: ProjectId.ALL,
    check: () => true,
  },
  {
    projectId: ProjectId.BRIDGES,
    check: (project) => project.type === 'bridge',
  },
  {
    projectId: ProjectId.LAYER2S,
    check: (project) => project.type === 'layer2',
  },
]

export function aggregateReports(
  reports: ReportRecord[],
  projects: ReportProject[],
  timestamp: UnixTime,
): AggregatedReportRecord[] {
  return aggregateReportsWithCategories(
    reports,
    projects,
    DEFAULT_CATEGORIES,
    timestamp,
  )
}

export function aggregateReportsWithCategories(
  reports: ReportRecord[],
  projects: ReportProject[],
  categories: Category[],
  timestamp: UnixTime,
): AggregatedReportRecord[] {
  const categorized = categories.map(({ projectId }) => ({
    timestamp,
    projectId,
    valueEth: 0n,
    valueUsd: 0n,
    valueType: ValueType.TVL,
  }))

  const aggregatedReports: AggregatedReportRecord[] = []

  for (const project of projects) {
    const filteredReports = reports.filter(
      (x) => x.projectId === project.projectId,
    )
    const { valueEth, valueUsd } = filteredReports.reduce(
      (acc, next) => ({
        valueUsd: acc.valueUsd + next.usdValue,
        valueEth: acc.valueEth + next.ethValue,
      }),
      { valueUsd: 0n, valueEth: 0n },
    )
    for (const [i, { check }] of categories.entries()) {
      if (check(project)) {
        categorized[i].valueEth += valueEth
        categorized[i].valueUsd += valueUsd
      }
    }
    aggregatedReports.push({
      projectId: project.projectId,
      valueType: ValueType.TVL,
      timestamp,
      valueEth,
      valueUsd,
    })
  }

  aggregatedReports.push(...categorized)

  return aggregatedReports
}
