import { ProjectId, UnixTime, ValueType } from '@l2beat/shared-pure'

import { AggregatedReportRecord } from '../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { ReportProject } from './ReportProject'
import { ReportTree } from './reportTree'

interface AggregatedValues {
  usdValue: bigint
  ethValue: bigint
}

type AggregatedReportTree = ReportTree<
  ReportProject,
  ValueType,
  AggregatedValues
>

type NotAggregatedReportTree = ReportTree<
  ReportProject,
  ValueType,
  ReportRecord[]
>

type SerializableReportTree = ReportTree<ProjectId, ValueType, AggregatedValues>

export function aggregateReports(
  reports: ReportRecord[],
  projects: ReportProject[],
  timestamp: UnixTime,
): AggregatedReportRecord[] {
  const reportTree = buildReportTree(reports, projects)

  const reportTreeWithValues = aggregateReportTree(reportTree)

  const aggregatedReports = serializeReportTree(reportTreeWithValues, timestamp)

  return aggregatedReports
}

function buildReportTree(
  reports: ReportRecord[],
  projects: ReportProject[],
): NotAggregatedReportTree {
  const projectMap = new Map([
    ...projects.map((x) => [x.projectId, x] as const),
  ])

  const uniqueProjects = [...projectMap.values()]

  const reportTree = ReportTree.from(
    uniqueProjects,
    [ValueType.CBV, ValueType.EBV, ValueType.NMV],
    () => [] as ReportRecord[],
  )

  for (const project of uniqueProjects) {
    const filteredReports = reports.filter(
      (x) => x.projectId === project.projectId,
    )

    for (const report of filteredReports) {
      reportTree.get(project, report.type).push(report)
    }
  }

  return reportTree
}

function aggregateReportTree(
  tree: NotAggregatedReportTree,
): SerializableReportTree {
  const projects = tree.getRoots()
  const projectIds = projects.map((x) => x.projectId)

  const reportTree = ReportTree.from(
    projects,
    [ValueType.CBV, ValueType.EBV, ValueType.NMV, ValueType.TVL],
    () => ({
      usdValue: 0n,
      ethValue: 0n,
    }),
  )

  for (const [project, valueMap] of tree) {
    let projectEthValue = 0n
    let projectUsdValue = 0n

    for (const [valueType, reports] of valueMap) {
      const usdValue = reports.reduce((acc, next) => acc + next.usdValue, 0n)
      const ethValue = reports.reduce((acc, next) => acc + next.ethValue, 0n)

      reportTree.set(project, valueType, () => ({
        usdValue,
        ethValue,
      }))

      projectEthValue += ethValue
      projectUsdValue += usdValue
    }

    reportTree.set(project, ValueType.TVL, () => ({
      usdValue: projectUsdValue,
      ethValue: projectEthValue,
    }))
  }

  const categoriesTree = deriveCategoryTree(reportTree)

  const finalTree = reportTree
    .replaceRoots(projectIds)
    .mergeWith(categoriesTree)

  return finalTree
}

function deriveCategoryTree(
  tree: AggregatedReportTree,
): SerializableReportTree {
  const categoriesTree = ReportTree.from(
    [ProjectId.ALL, ProjectId.BRIDGES, ProjectId.LAYER2S],
    [ValueType.CBV, ValueType.EBV, ValueType.NMV, ValueType.TVL],
    () => ({
      usdValue: 0n,
      ethValue: 0n,
    }),
  )

  for (const [project, valueMap] of tree) {
    const targetType =
      project.type === 'bridge' ? ProjectId.BRIDGES : ProjectId.LAYER2S
    for (const [valueType, values] of valueMap) {
      categoriesTree.set(targetType, valueType, ({ usdValue, ethValue }) => {
        return {
          usdValue: usdValue + values.usdValue,
          ethValue: ethValue + values.ethValue,
        }
      })

      categoriesTree.set(ProjectId.ALL, valueType, ({ usdValue, ethValue }) => {
        return {
          usdValue: usdValue + values.usdValue,
          ethValue: ethValue + values.ethValue,
        }
      })
    }
  }

  return categoriesTree
}

function serializeReportTree(
  reportTree: SerializableReportTree,
  timestamp: UnixTime,
): AggregatedReportRecord[] {
  const records: AggregatedReportRecord[] = []

  for (const [projectId, valueMap] of reportTree) {
    for (const [type, { ethValue, usdValue }] of valueMap) {
      records.push({
        projectId,
        timestamp,
        valueType: type,
        ethValue,
        usdValue,
      })
    }
  }

  return records
}
