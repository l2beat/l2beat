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
    ethValue: 0n,
    usdValue: 0n,
    valueType: ValueType.TVL,
  }))

  const aggregatedReports: AggregatedReportRecord[] = []

  for (const project of projects) {
    const filteredReports = reports.filter(
      (x) => x.projectId === project.projectId,
    )
    const { ethValue, usdValue } = filteredReports.reduce(
      (acc, next) => ({
        usdValue: acc.usdValue + next.usdValue,
        ethValue: acc.ethValue + next.ethValue,
      }),
      { usdValue: 0n, ethValue: 0n },
    )
    for (const [i, { check }] of categories.entries()) {
      if (check(project)) {
        categorized[i].ethValue += ethValue
        categorized[i].usdValue += usdValue
      }
    }
    aggregatedReports.push({
      projectId: project.projectId,
      valueType: ValueType.TVL,
      timestamp,
      ethValue,
      usdValue,
    })
  }

  aggregatedReports.push(...categorized)

  return aggregatedReports
}
